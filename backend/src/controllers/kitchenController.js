import { success } from "zod";
import Order from "../models/Order.js";

export const getOrderItemPending = async (req, res) => {
  try {
    const { itemName, isPreOrder } = req.query;

    // Filter Order
    let orderMatch = {
      orderStatus: { $in: ["active", "pre-order"] },
    };

    if (isPreOrder !== undefined) {
      orderMatch.orderStatus = isPreOrder === "true" ? "pre-order" : "active";
    }

    // Filter Item
    let itemMatch = {
      "subOrders.items.status": { $in: ["pending", "preparing"] },
    };

    if (itemName) {
      itemMatch["subOrders.items.itemNamr"] = {
        $regex: itemName,
        $options: "i",
      };
    }

    const pendingItems = await Order.aggregate([
      // Lọc Order
      { $match: orderMatch },
      { $unwind: "$subOrders" },
      { $unwind: "$subOrders.items" },
      // Lọc Item
      { $match: itemMatch },

      // Thông tin bàn
      {
        $lookup: {
          form: "tables",
          localField: "subOrders.table",
          foreignField: "_id",
          as: "tableInfo",
        },
      },
      { $unwind: "$tableInfo" },

      // Thông tin Reservation
      {
        $lookup: {
          form: "reservations",
          localField: "reservation",
          foreignField: "_id",
          as: "resInfo",
        },
      },
      { $unwind: "$resInfo" },

      //   Logic tính mức độ ưu tiên
      {
        $addFields: {
          // số phút đã qua kể từ lúc đặt món:
          waitingTimeMinutes: {
            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 60000],
          },
          //   Gán trọng số
          statusWeight: {
            $cond: {
              if: { $eq: ["$orderStatus", "active"] },
              then: 50,
              else: 10,
            },
          },
        },
      },

      {
        $addFields: {
          // Điểm ưu tiên = số phút * 1.5 + trọng số
          priorityScore: {
            $add: [
              { $multiply: ["$waitingTimeMinutes", 1.5] },
              "$statusWeight",
            ],
          },
        },
      },
      {
        $project: {
          _id: "$subOrders.items._id",
          name: "$subOrders.items.itemName",
          qty: "$subOrders.items.quantity",
          note: "$subOrders.items.note",
          status: "$subOrders.items.status",
          orderStatus: "$orderStatus",
          wattingTime: { $floor: "$waitingTimeMinutes" },
          priorityScore: 1,
        },
      },
      // Sắp xếp theo điểm ưu tiên giảm dần
      { $sort: { priorityScore: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: pendingItems.length,
      data: pendingItems,
    });
  } catch (error) {
    console.error("Fetching pending order items error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order items",
      error: error.message,
    });
  }
};

export const getOrderItemsByDish = async (req, res) => {
  try {
    const { itemName } = req.query;

    // 1. Điều kiện lọc cơ bản
    let matchCondition = {
      "subOrders.items.status": { $in: ["pending", "preparing"] },
      orderStatus: { $in: ["active", "pre-order"] },
    };

    // Tìm kiếm theo tên món nếu có
    if (itemName) {
      matchCondition["subOrders.items.itemName"] = {
        $regex: itemName,
        $options: "i",
      };
    }

    const dishes = await Order.aggregate([
      // Trải phẳng dữ liệu để làm việc với từng món lẻ
      { $unwind: "$subOrders" },
      { $unwind: "$subOrders.items" },

      // Lọc các món đang chờ xử lý
      { $match: matchCondition },

      // 2. Gộp nhóm theo ID của MenuItem (hoặc tên món)
      {
        $group: {
          _id: "$subOrders.items.menuItem", // Gộp theo ID món ăn
          itemName: { $first: "$subOrders.items.itemName" },
          totalQty: { $sum: "$subOrders.items.quantity" }, // Tổng số lượng cần làm

          // Tạo mảng chi tiết để bếp biết món này thuộc những bàn nào
          details: {
            $push: {
              orderItemId: "$subOrders.items._id",
              table: "$subOrders.table", // Sẽ lookup tên bàn ở bước sau
              qty: "$subOrders.items.quantity",
              note: "$subOrders.items.note",
              createdAt: "$createdAt",
            },
          },
          // Lấy thời gian của đơn cũ nhất để ưu tiên nấu trước
          oldestOrder: { $min: "$createdAt" },
        },
      },

      // 3. Lookup để lấy thêm thông tin chi tiết (Tên bàn, Ảnh món ăn)
      {
        $lookup: {
          from: "menuItems",
          localField: "_id",
          foreignField: "_id",
          as: "menuInfo",
        },
      },
      { $unwind: "$menuInfo" },

      // 4. Sắp xếp món nào có đơn đợi lâu nhất lên đầu
      { $sort: { oldestOrder: 1 } },

      // 5. Định dạng lại kết quả trả về
      {
        $project: {
          _id: 1,
          itemName: 1,
          totalQty: 1,
          image: { $arrayElemAt: ["$menuInfo.images", 0] },
          details: 1,
          oldestOrder: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: dishes.length,
      data: dishes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderItemsByTable = async (req, res) => {
  try {
    const { tableName } = req.query;

    // 1. Điều kiện lọc cơ bản: Đơn hàng đang hoạt động và món chưa hoàn thành
    let matchCondition = {
      orderStatus: { $in: ["active", "pre-order"] },
      "subOrders.items.status": { $in: ["pending", "preparing"] },
    };

    const ordersByTable = await Order.aggregate([
      // Trải phẳng subOrders để xử lý từng bàn lẻ
      { $unwind: "$subOrders" },
      // Trải phẳng items để lọc đúng trạng thái từng món
      { $unwind: "$subOrders.items" },

      // Lọc dữ liệu
      { $match: matchCondition },

      // 2. Kết nối với bảng Table để lấy thông tin tên bàn
      {
        $lookup: {
          from: "tables",
          localField: "subOrders.table",
          foreignField: "_id",
          as: "tableDetail",
        },
      },
      { $unwind: "$tableDetail" },

      // Lọc theo tên bàn nếu người dùng search
      ...(tableName
        ? [
            {
              $match: {
                "tableDetail.tableName": { $regex: tableName, $options: "i" },
              },
            },
          ]
        : []),

      // 3. Gộp nhóm theo ID của bàn
      {
        $group: {
          _id: "$subOrders.table",
          tableName: { $first: "$tableDetail.tableName" },
          orderId: { $first: "$_id" },
          orderStatus: { $first: "$orderStatus" },
          // Gom các món ăn của bàn này vào một mảng
          items: {
            $push: {
              orderItemId: "$subOrders.items._id",
              itemName: "$subOrders.items.itemName",
              quantity: "$subOrders.items.quantity",
              note: "$subOrders.items.note",
              status: "$subOrders.items.status",
              createdAt: "$createdAt",
            },
          },
          // Lấy thời gian đơn hàng đầu tiên của bàn này để sắp xếp
          minCreatedAt: { $min: "$createdAt" },
        },
      },

      // 4. Sắp xếp: Bàn nào có món đợi lâu nhất sẽ hiện lên đầu
      { $sort: { minCreatedAt: 1 } },

      {
        $project: {
          _id: 1,
          tableName: 1,
          orderId: 1,
          orderStatus: 1,
          items: 1,
          itemCount: { $size: "$items" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: ordersByTable.length,
      data: ordersByTable,
    });
  } catch (error) {
    console.error("Get orders by table error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi lấy dữ liệu theo bàn",
        error: error.message,
      });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const { status, quantityToUpdate } = req.body;
    const user = req.user;

    // 1. Kiểm tra quyền
    if (user.role !== "kitchenStaff" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // 2. TÌm Order
    const order = await Order.findOne({ "subOrders.items._id": orderItemId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy món ăn" });
    }

    // 3. Tìm vị trí chính xác của subOrder và Item
    let subOrderIndex = -1;
    let itemIndex = -1;

    order.subOrders.forEach((sub, sIdx) => {
      const iIdx = sub.items.findIndex(
        (item) => item._id.toString() === orderItemId,
      );
      if (iIdx > -1) {
        subOrderIndex = sIdx;
        itemIndex = iIdx;
      }
    });

    const targetItem = order.subOrders[subOrderIndex].items[itemIndex];
    const currentQty = targetItem.quantity;

    // Số lượng thực thế sẽ cập nhật
    const updateQty =
      quantityToUpdate === "all" || !quantityToUpdate
        ? currentQty
        : parseInt(quantityToUpdate);

    // 4. Tách bản ghi
    if (updateQty < currentQty) {
      // Th1: cập nhật 1 món
      const newItem = {
        menuItem: targetItem.menuItem,
        itemName: targetItem.itemName,
        unitPrice: targetItem.unitPrice,
        quantity: updateQty,
        note: targetItem.note,
        status: status,
        subTotal: targetItem.unitPrice * updateQty,
        _id: new mongoose.Types.ObjectId(),
      };

      targetItem.quantity = currentQty - updateQty;
      targetItem.subTotal = targetItem.unitPrice * targetItem.quantity;

      order.subOrders[subOrderIndex].items.push(newItem);
    } else {
      // Th2: cập nhật tất cả
      targetItem.status = status;
    }

    // 5. Lưu thay đổi
    await order.save();

    res.status(200).json({
      success: true,
      message: `Đã cập nhật ${updateQty} món thành ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update item status error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi cập nhật trạng thái",
      error: error.message,
    });
  }
};
