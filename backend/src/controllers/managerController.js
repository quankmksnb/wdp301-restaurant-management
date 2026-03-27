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


