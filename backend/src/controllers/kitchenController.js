import Order from "../models/Order.js";
import mongoose from "mongoose";

export const getOrderItemsByPriority = async (req, res) => {
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
      "subOrders.items.status": { $in: ["order_sent", "preparing"] },
    };

    if (itemName) {
      itemMatch["subOrders.items.itemName"] = {
        $regex: itemName,
        $options: "i",
      };
    }

    const orderItems = await Order.aggregate([
      // Lọc Order
      { $match: orderMatch },
      { $unwind: "$subOrders" },
      { $unwind: "$subOrders.items" },
      // Lọc Item
      { $match: itemMatch },

      // Thông tin bàn
      {
        $lookup: {
          from: "tables",
          localField: "subOrders.table",
          foreignField: "_id",
          as: "tableInfo",
        },
      },
      { $unwind: "$tableInfo" },

      // Thông tin Reservation
      {
        $lookup: {
          from: "reservations",
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
            $divide: [
              { $subtract: [new Date(), "$subOrders.items.createdAt"] },
              60000,
            ],
          },
          statusSortOrder: {
            $cond: {
              if: { $eq: ["subOrders.items.status", "preparing"] },
              then: 1,
              else: 2,
            },
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
      { $sort: { statusSortOrder: 1, priorityScore: -1 } },
      {
        $project: {
          _id: "$subOrders.items._id",
          name: "$subOrders.items.itemName",
          qty: "$subOrders.items.quantity",
          note: "$subOrders.items.note",
          status: "$subOrders.items.status",
          orderStatus: "$orderStatus",
          waitingTime: { $floor: "$waitingTimeMinutes" },
          priorityScore: 1,
          table: {
            _id: "$tableInfo._id",
            tableName: "$tableInfo.tableName",
            tableNumber: "$tableInfo.tableNumber",
            capacity: "$tableInfo.capacity",
          },
        },
      },
      // Sắp xếp theo điểm ưu tiên giảm dần
      { $sort: { priorityScore: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: orderItems.length,
      data: orderItems,
    });
  } catch (error) {
    console.error("Fetching order items error:", error);
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
      "subOrders.items.status": { $in: ["order_sent", "preparing"] },
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
          _id: {
            menuItem: "$subOrders.items.menuItem",
            status: "$subOrders.items.status",
          },
          itemName: { $first: "$subOrders.items.itemName" },
          status: { $first: "$subOrders.items.status" },
          totalQty: { $sum: "$subOrders.items.quantity" }, // Tổng số lượng cần làm

          // Tạo mảng chi tiết để bếp biết món này thuộc những bàn nào
          details: {
            $push: {
              orderItemId: "$subOrders.items._id",
              table: "$subOrders.table", // Sẽ lookup tên bàn ở bước sau
              qty: "$subOrders.items.quantity",
              note: "$subOrders.items.note",
              createdAt: "$subOrders.items.createdAt",
            },
          },
          // Lấy thời gian của đơn cũ nhất để ưu tiên nấu trước
          oldestOrder: { $min: "$subOrders.items.createdAt" },
        },
      },
      {
        $addFields: {
          statusSortOrder: {
            $cond: { if: { $eq: ["$status", "preparing"] }, then: 1, else: 2 },
          },
        },
      },
      { $sort: { statusSortOrder: 1, oldestOrder: 1 } },
      // 3. Lookup để lấy thêm thông tin chi tiết (Tên bàn, Ảnh món ăn)
      {
        $lookup: {
          from: "menuItems",
          localField: "_id.menuItem",
          foreignField: "_id",
          as: "menuInfo",
        },
      },
      {
        $unwind: {
          path: "$menuInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

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
          status: "$_id.status",
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
      "subOrders.items.status": { $in: ["order_sent", "preparing"] },
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
              statusSortOrder: {
                $cond: {
                  if: { $eq: ["$subOrders.items.status", "preparing"] },
                  then: 1,
                  else: 2,
                },
              },
              orderItemId: "$subOrders.items._id",
              itemName: "$subOrders.items.itemName",
              quantity: "$subOrders.items.quantity",
              note: "$subOrders.items.note",
              status: "$subOrders.items.status",
              createdAt: "$subOrders.items.createdAt",
            },
          },
          // Lấy thời gian đơn hàng đầu tiên của bàn này để sắp xếp
          minCreatedAt: { $min: "$subOrders.items.createdAt" },
        },
      },
      {
        $addFields: {
          items: {
            $sortArray: {
              input: "$items",
              sortBy: { statusSortOrder: 1, createdAt: 1 },
            },
          },
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
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy dữ liệu theo bàn",
      error: error.message,
    });
  }
};

export const getReadyToServeItems = async (req, res) => {
  try {
    const readyItems = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ["active", "pre-order"] },
        },
      },

      { $unwind: "$subOrders" },
      { $unwind: "$subOrders.items" },

      {
        $match: {
          "subOrders.items.status": "ready",
        },
      },

      {
        $lookup: {
          from: "tables",
          localField: "subOrders.table",
          foreignField: "_id",
          as: "tableInfo",
        },
      },
      { $unwind: "$tableInfo" },

      {
        $project: {
          _id: "$subOrders.items._id",
          orderId: "$_id",
          itemName: "$subOrders.items.itemName",
          quantity: "$subOrders.items.quantity",
          note: "$subOrders.items.note",
          tableName: "$tableInfo.tableName",
          updatedAt: "$subOrders.items.updatedAt",
        },
      },

      { $sort: { updatedAt: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: readyItems.length,
      data: readyItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách món chờ cung ứng",
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
    if (user.role !== "kitchenStaff") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // 2. Tìm Order
    const order = await Order.findOne({ "subOrders.items._id": orderItemId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy món ăn" });
    }

    // 3. Tìm vị trí chính xác của subOrder và Item đang thao tác
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

    const targetSubOrder = order.subOrders[subOrderIndex];
    const targetItem = targetSubOrder.items[itemIndex];
    const currentQty = targetItem.quantity;

    const updateQty =
      quantityToUpdate === "all" || !quantityToUpdate
        ? currentQty
        : parseInt(quantityToUpdate);

    // 4. Logic Xử lý Trạng thái & Cộng dồn
    if (updateQty < currentQty) {
      // Trường hợp tách món: Làm xong một phần

      // Bước A: Tìm xem trong cùng subOrder đã có món này với trạng thái 'status' mục tiêu chưa
      // Điều kiện: Cùng menuItem AND cùng trạng thái AND cùng ghi chú (nếu cần khắt khe)
      const existingItem = targetSubOrder.items.find(
        (item) =>
          item.menuItem.toString() === targetItem.menuItem.toString() &&
          item.status === status &&
          item.note === targetItem.note &&
          item._id.toString() !== orderItemId, // Không phải chính nó
      );

      if (existingItem) {
        // Nếu đã có bản ghi ở trạng thái đó rồi (ví dụ đã có 1 Gà rang 'ready')
        // Thì cộng dồn số lượng vào bản ghi đó
        existingItem.quantity += updateQty;
        existingItem.subTotal = existingItem.unitPrice * existingItem.quantity;
      } else {
        // Nếu chưa có, tạo bản ghi mới (như logic cũ của bạn)
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
        targetSubOrder.items.push(newItem);
      }

      // Bước B: Trừ số lượng ở bản ghi gốc (phần chưa làm xong)
      targetItem.quantity = currentQty - updateQty;
      targetItem.subTotal = targetItem.unitPrice * targetItem.quantity;
    } else {
      // Trường hợp cập nhật tất cả hoặc số lượng bằng hiện tại
      // Trước khi đổi status, cũng nên kiểm tra xem có bản ghi nào khác cùng status để gộp không
      const existingItem = targetSubOrder.items.find(
        (item) =>
          item.menuItem.toString() === targetItem.menuItem.toString() &&
          item.status === status &&
          item.note === targetItem.note &&
          item._id.toString() !== orderItemId,
      );

      if (existingItem) {
        // Gộp vào bản ghi cũ và xóa bản ghi hiện tại
        existingItem.quantity += updateQty;
        existingItem.subTotal = existingItem.unitPrice * existingItem.quantity;
        targetSubOrder.items.splice(itemIndex, 1);
      } else {
        // Nếu không có gì để gộp, chỉ đơn giản là đổi trạng thái
        targetItem.status = status;
      }
    }

    // 5. Lưu thay đổi (Middleware pre-save sẽ tính lại tổng tiền cho bạn)
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

export const updateBulkItemStatus = async (req, res) => {
  try {
    const { itemIds, status } = req.body;
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Danh sách ID không hợp lệ" });
    }

    await Order.updateMany(
      {
        "subOrders.items._id": {
          $in: itemIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
      { $set: { "subOrders.$[].items.$[item].status": status } },
      {
        arrayFilters: [
          {
            "item._id": {
              $in: itemIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        ],
        multi: true,
      },
    );
    res.status(200).json({
      success: true,
      message: `Đã cập nhật ${itemIds.length} mục sang trạng thái ${status}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
