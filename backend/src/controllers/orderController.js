import mongoose from "mongoose";
import Order from "../models/Order.js";
import Reservation from "../models/Reservation.js";
import MenuItem from "../models/MenuItem.js";

// Thêm món vào bàn
export const addItemToTable = async (req, res) => {
  try {
    const { orderId, tableId } = req.params;
    const { menuItemId, quantity } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item không tồn tại",
      });
    }

    const subOrder = order.subOrders.find(
      s => s.table.toString() === tableId
    );

    if (!subOrder) {
      return res.status(404).json({
        success: false,
        message: "Bàn không trong order này",
      });
    }

    // ✅ chỉ tìm item có status pending
    const existingItem = subOrder.items.find(
      i =>
        i.menuItem.toString() === menuItemId &&
        i.status === "pending"
    );

    if (existingItem) {
      // tăng quantity
      existingItem.quantity += quantity;
      existingItem.subTotal =
        existingItem.unitPrice * existingItem.quantity;
    } else {
      // tạo item mới
      subOrder.items.push({
        menuItem: menuItemId,
        itemName: menuItem.itemName,
        unitPrice: menuItem.price,
        quantity,
        note: "",
        status: "pending",
        subTotal: menuItem.price * quantity,
      });
    }

    await order.save();

    res.json({
      success: true,
      message: "Thêm món thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Gửi món xuống bếp
export const sendItemsToKitchen = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemIds } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    const itemIdStrings = itemIds.map((id) =>
      id.toString ? id.toString() : id
    );

    const updatedItems = [];
    const invalidItems = [];

    order.subOrders.forEach((sub) => {
      sub.items.forEach((item) => {
        const itemIdStr = item._id.toString();
        const isInList = itemIdStrings.includes(itemIdStr);

        // ✅ cho phép pre-order + pending
        const isValidStatus = ["pending", "pre-order"].includes(item.status);

        if (isInList && isValidStatus) {
          item.status = "order_sent";

          updatedItems.push({
            _id: item._id,
            itemName: item.itemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            status: item.status,
          });
        } else if (isInList) {
          invalidItems.push({
            _id: item._id,
            currentStatus: item.status,
          });
        }
      });
    });

    if (updatedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có món hợp lệ để gửi bếp",
        invalidItems,
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Đã gửi món xuống bếp",
      data: updatedItems,
      invalidItems, // optional: để debug FE
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Hủy món
export const cancelItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);

    let foundItem = null;

    order.subOrders.forEach((sub) => {
      sub.items.forEach((item) => {
        if (item._id.toString() === itemId) {
          foundItem = item;
        }
      });
    });

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: "Item không tồn tại",
      });
    }

    if (foundItem.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy món đã gửi xuống bếp",
      });
    }

    foundItem.status = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Đã hủy món",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy bill hiện tại của bàn
export const getCurrentBillByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const order = await Order.findOne({
      orderStatus: "active",
      "subOrders.table": new mongoose.Types.ObjectId(tableId),
    }).populate("subOrders.table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Bàn chưa có order",
      });
    }

    const subOrder = order.subOrders.find(
      (sub) => sub.table._id.toString() === tableId
    );

    res.status(200).json({
      success: true,
      data: {
        table: subOrder.table,
        items: subOrder.items,
        subTotal: subOrder.subTotalAmount,
        totalAmount: order.totalAmount,
        finalAmount: order.finalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy bill chi tiết của order
export const getOrderBill = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('subOrders.table')
      .populate('subOrders.items.menuItem');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    // ✅ Map dữ liệu để trả về dạng clean
    const billData = {
      tables: order.subOrders.map(sub => ({
        table: sub.table,
        items: sub.items.map(item => ({
          _id: item._id,           // ✅ Thêm _id của order item
          itemId: item.menuItem._id,
          itemName: item.itemName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.subTotal,
          status: item.status,
          note: item.note || "",
        })),
        subTotal: sub.subTotalAmount,
      })),
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
    };

    res.json({
      success: true,
      data: billData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy order theo reservation ID (dùng cho edit reservation)
export const getOrderByReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    
    const order = await Order.findOne({ reservation: reservationId })
      .populate('subOrders.table')
      .populate('subOrders.items.menuItem');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};