import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";

export const getRevenueSummary = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(new Date(startDate).setHours(0, 0, 0));
  const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  try {
    const payments = await Payment.find({
      paymentStatus: "completed",
      paymentDate: {
        $gte: start,
        $lte: end,
      },
    });
    const summary = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          paymentDate: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderData",
        },
      },
      { $unwind: { path: "$orderData", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$orderData.subOrders",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$orderData.subOrders.items",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "menuItems",
          localField: "orderData.subOrders.items.menuItem",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: { path: "$itemDetails", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,

          allPayments: { $addToSet: { pId: "$_id", amt: "$amount" } },

          // Tính giá vốn
          totalCost: {
            $sum: {
              $multiply: [
                { $ifNull: ["$itemDetails.costPrice", 0] },
                { $ifNull: ["$orderData.subOrders.items.quantity", 0] },
              ],
            },
          },

          orderCount: { $addToSet: "$order" },
        },
      },
      {
        $project: {
          _id: 0,
          revenue: { $sum: "$allPayments.amt" },
          profit: {
            $subtract: [{ $sum: "$allPayments.amt" }, "$totalCost"],
          },
          orderCount: { $size: "$orderCount" },
        },
      },
    ]);

    res.status(200).json(
      summary[0] || {
        revenue: 0,
        profit: 0,
        orderCount: 0,
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy kết quả doanh thu", error });
  }
};

export const getRevenueChartData = async (req, res) => {
  try {
    const { type } = req.query;
    let groupBy = "";
    let dateFilter = new Date();

    if (type === "week") {
      dateFilter.setDate(dateFilter.getDate() - 7);
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } };
    } else if (type === "month") {
      dateFilter = new Date(dateFilter.getFullYear(), dateFilter.getMonth(), 1);
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } };
    } else if (type === "year") {
      dateFilter = new Date(dateFilter.getFullYear(), 0, 1);
      groupBy = { $dateToString: { format: "%Y-%m", date: "$paymentDate" } };
    }

    const chartData = await Payment.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          paymentDate: { $gte: dateFilter },
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu cho biểu đồ",
      error: error.message,
    });
  }
};

export const getLiveOperationsStatus = async (req, res) => {
  try {
    // Lấy số bàn đang có khách
    const activeReservations = await Reservation.find({
      status: "seated",
    }).select("tables");
    // dùng Set để đếm số bàn duy nhất
    const uniqueTableIds = new Set();
    activeReservations.forEach((resv) => {
      resv.tables.forEach((tableId) => uniqueTableIds.add(tableId.toString()));
    });

    const activeTablesCount = uniqueTableIds.size;

    // Số món ăn bếp cần làm
    const kitchenProcessingStats = await Order.aggregate([
      {
        $match: {
          orderStatus: "active",
        },
      },
      { $unwind: "$subOrders" },
      { $unwind: "$subOrders.items" },
      {
        $match: {
          "subOrders.items.status": { $in: ["order_sent", "preparing"] },
        },
      },
      {
        $group: {
          _id: "$subOrders.items.status",
          count: { $sum: "$subOrders.items.quantity" },
        },
      },
    ]);

    const kitchenStats = {
      orderSent: 0,
      preparing: 0,
      totalProcessing: 0,
    };

    kitchenProcessingStats.forEach((stat) => {
      if (stat._id === "order_sent") kitchenStats.orderSent = stat.count;
      if (stat._id === "preparing") kitchenStats.preparing = stat.count;
    });

    kitchenStats.totalProcessing =
      kitchenStats.orderSent + kitchenStats.preparing;

    res.status(200).json({
      activeTables: activeTablesCount,
      kitchenStatus: kitchenStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu",
      error: error.message,
    });
  }
};

export const getTopSellingItems = async (req, res) => {
  const { period } = req.query;

  let startDate = new Date();
  const endDate = new Date();

  // 1. Xử lý thời gian
  if (period === "week") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "month") {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  } else if (period === "year") {
    startDate = new Date(startDate.getFullYear(), 0, 1);
  }
  startDate.setHours(0, 0, 0, 0);

  try {
    const topItems = await Order.aggregate([
      {
        $match: {
          orderStatus: "completed",
          orderDate: { $gte: startDate, $lte: endDate },
        },
      },
      // Phẳng hóa mảng subOrders
      { $unwind: "$subOrders" },
      // Phẳng hóa mảng items bên trong mỗi subOrder
      { $unwind: "$subOrders.items" },
      {
        $match: {
          // LƯU Ý: Trong database của bạn có nhiều món bị "cancelled"
          // Chúng ta chỉ lọc những món đã phục vụ thành công
          "subOrders.items.status": "served",
        },
      },
      {
        $group: {
          // Nhóm theo ID món ăn để đảm bảo tính riêng biệt
          _id: "$subOrders.items.menuItem",
          // Lấy tên món từ snapshot trong đơn hàng
          name: { $first: "$subOrders.items.itemName" },
          // Tổng số lượng bán ra
          value: { $sum: "$subOrders.items.quantity" },
          // Tổng doanh thu của món đó
          revenue: { $sum: "$subOrders.items.subTotal" },
        },
      },
      // Sắp xếp theo số lượng bán nhiều nhất
      { $sort: { value: -1 } },
      // Lấy Top 10
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: 1,
          value: 1,
          revenue: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
