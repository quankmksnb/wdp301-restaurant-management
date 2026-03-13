import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";

// Create or update order items for a table
export const orderItems = async (req, res) => {
  try {
    const { tableId, items } = req.body;

    const table = await Table.findById(tableId).populate("area");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Bàn không tồn tại",
      });
    }

    let order = await Order.findOne({ table: tableId });

    if (!order) {
      order = new Order({
        table: tableId,
        items: [],
        totalAmount: 0,
      });
    }

    let totalAdd = 0;

    for (const item of items) {
      const menu = await MenuItem.findById(item.menuItem);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Món ăn không tồn tại",
        });
      }

      // ✅ CHECK STATUS
      if (menu.availabilityStatus !== "available") {
        return res.status(400).json({
          success: false,
          message: `Mặt hàng "${menu.itemName}" đã ngừng kinh doanh`,
        });
      }

      const subTotal = menu.price * item.quantity;

      order.items.push({
        menuItem: menu._id,
        itemName: menu.itemName,
        unitPrice: menu.price,
        quantity: item.quantity,
        subTotal,
        orderItemStatus: "pending",
      });

      totalAdd += subTotal;
    }

    order.totalAmount += totalAdd;

    await order.save();

    res.json({
      success: true,
      data: {
        orderId: order._id,
        table: {
          tableId: table._id,
          tableName: table.tableName,
          areaName: table.area?.areaName,
        },
        totalAmount: order.totalAmount,
        items: order.items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send order items to kitchen (change status to preparing)
export const sendToKitchen = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    order.items.forEach(item => {
      if (item.orderItemStatus === "pending") {
        item.orderItemStatus = "preparing";
      }
    });

    await order.save();

    res.json({
      success: true,
      message: "Đã gửi món xuống bếp",
      data: order.items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel an order item
export const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "OrderItem không tồn tại",
      });
    }

    if (item.orderItemStatus !== "preparing") {
      return res.status(400).json({
        success: false,
        message: "Chỉ được hủy món khi đang preparing",
      });
    }

    item.orderItemStatus = "cancelled";

    order.totalAmount -= item.subTotal;

    await order.save();

    res.json({
      success: true,
      message: "Hủy món thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current order by table
export const getCurrentOrderByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate("area", "areaName");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Bàn không tồn tại",
      });
    }

    const order = await Order.findOne({ table: tableId })
      .populate("items.menuItem", "itemName price images");

    // nếu bàn chưa có order
    if (!order) {
      return res.status(200).json({
        success: true,
        data: {
          table: {
            tableId: table._id,
            tableName: table.tableName,
            areaName: table.area?.areaName,
          },
          items: [],
          totalAmount: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        table: {
          tableId: table._id,
          tableName: table.tableName,
          areaName: table.area?.areaName,
        },
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};