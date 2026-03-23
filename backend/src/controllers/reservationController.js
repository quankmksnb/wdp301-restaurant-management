import Reservation from "../models/Reservation.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";

import {
  getAvailableTables,
  validateTablesForReservation,
} from "../services/tableService.js";

/**
 * GET /api/reservations/available-tables
 */
export const getAvailableTablesController = async (req, res) => {
  try {
    const { dateTime } = req.query;

    if (!dateTime) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dateTime",
      });
    }

    const tables = await getAvailableTables(dateTime);

    res.json({
      success: true,
      total: tables.length,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bàn trống",
      error: error.message,
    });
  }
};

/**
 * GET /api/reservations/reserved-tables
 * Lấy danh sách các bàn đã đặt (confirmed / seated)
 */
export const getReservedTablesController = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: { $in: ["confirmed", "seated", "cancelled"] },
    })
      .populate({
        path: "tables",
        populate: { path: "area", select: "areaName" },
      })
      .sort({ reservationDateTime: -1 });

    res.json({
      success: true,
      total: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bàn đã đặt",
      error: error.message,
    });
  }
};

/**
 * POST /api/reservations
 * Đặt bàn bình thường (không gọi món)
 */
export const createReservation = async (req, res) => {
  try {
    const { tables, reservationDateTime } = req.body;

    const validation = await validateTablesForReservation(tables, reservationDateTime);
    if (new Date(reservationDateTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Không được đặt bàn ở quá khứ",
      });
    }

    // Kiểm tra số khách không vượt quá tổng số ghế
    const { numberOfGuests } = req.body;
    const selectedTableDocs = await Table.find({ _id: { $in: tables } });
    const totalCapacity = selectedTableDocs.reduce((sum, t) => sum + (t.capacity || 0), 0);
    if (numberOfGuests > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `Số khách (${numberOfGuests}) vượt quá tổng số ghế (${totalCapacity})`,
      });
    }

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        tables: validation.tables,
      });
    }

    const reservation = await Reservation.create({
      ...req.body,
      user: req.user?.id,
    });

    // Tự động tạo order rỗng cho reservation
    const subOrders = tables.map((tableId) => ({
      table: tableId,
      items: [],
      subTotalAmount: 0,
    }));

    await Order.create({
      reservation: reservation._id,
      orderStatus: "pre-order",
      subOrders,
      user: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Đặt bàn thành công",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo reservation",
      error: error.message,
    });
  }
};

/**
 * POST /api/reservations/pre-order
 * Đặt bàn + gọi món trước
 */
export const createReservationWithOrder = async (req, res) => {
  try {
    const {
      tables,
      items,
      orderMode,
      reservationDateTime,
      numberOfGuests,
      customer,
      note,
    } = req.body;

    // Kiểm tra không được đặt bàn ở quá khứ
    if (new Date(reservationDateTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Không được đặt bàn ở quá khứ",
      });
    }

    // Kiểm tra số khách không vượt quá tổng số ghế
    const selectedTableDocs = await Table.find({ _id: { $in: tables } });
    const totalCapacity = selectedTableDocs.reduce((sum, t) => sum + (t.capacity || 0), 0);
    if (numberOfGuests > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `Số khách (${numberOfGuests}) vượt quá tổng số ghế (${totalCapacity})`,
      });
    }

    const validation = await validateTablesForReservation(tables, reservationDateTime);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        tables: validation.tables,
      });
    }

    const reservation = await Reservation.create({
      reservationDateTime,
      numberOfGuests,
      tables,
      customer,
      note,
      user: req.user?.id,
    });

    let subOrders = [];

    let menuItemIds = [];

    if (orderMode === "same") {
      menuItemIds = items.map((i) => i.menuItem);
    }

    if (orderMode === "separate") {
      menuItemIds = items.flatMap((t) => t.items.map((i) => i.menuItem));
    }

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
    });

    const menuMap = {};

    menuItems.forEach((menu) => {
      menuMap[menu._id.toString()] = menu;
    });

    //CASE 1: same

    if (orderMode === "same") {
      for (const table of tables) {
        const orderItems = items.map((item) => {
          const menu = menuMap[item.menuItem];

          if (!menu) {
            return res.status(400).json({
              success: false,
              message: `Menu item không tồn tại: ${item.menuItem}`,
            });
          }

          return {
            menuItem: menu._id,
            itemName: menu.itemName,
            unitPrice: menu.price,
            quantity: item.quantity,
            note: item.note || "",
            status: "pre-order",
            subTotal: menu.price * item.quantity,
          };
        });

        subOrders.push({
          table,
          items: orderItems,
          subTotalAmount: 0,
        });
      }
    }

    // CASE 2: separate

    if (orderMode === "separate") {
      for (const tableOrder of items) {
        if (!tables.includes(tableOrder.table)) {
          return res.status(400).json({
            success: false,
            message: "Table không hợp lệ trong order",
          });
        }

        const orderItems = tableOrder.items.map((item) => {
          const menu = menuMap[item.menuItem];

          if (!menu) {
            return res.status(400).json({
              success: false,
              message: `Menu item không tồn tại: ${item.menuItem}`,
            });
          }

          return {
            menuItem: menu._id,
            itemName: menu.itemName,
            unitPrice: menu.price,
            quantity: item.quantity,
            note: item.note || "",
            status: "pre-order",
            subTotal: menu.price * item.quantity,
          };
        });

        subOrders.push({
          table: tableOrder.table,
          items: orderItems,
          subTotalAmount: 0,
        });
      }
    }

    const order = await Order.create({
      reservation: reservation._id,
      orderStatus: "pre-order",
      subOrders,
      user: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Đặt bàn và gọi món trước thành công",
      reservation,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo reservation + order",
      error: error.message,
    });
  }
};

// api update status
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const allowedStatus = [
      "confirmed",
      "seated",
      "no_show",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy reservation",
      });
    }

    // Không cho phép hủy nếu đã nhận bàn, hoàn thành, hoặc đã hủy
    if (status === "cancelled" && ["seated", "completed", "cancelled"].includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy bàn đã nhận, đã hoàn thành hoặc đã hủy",
      });
    }

    reservation.status = status;

    // nếu khách nhận bàn → chỉ cho phép nhận bàn trong ngày hôm nay
    if (status === "seated") {
      const today = new Date();
      const resDate = new Date(reservation.reservationDateTime);
      if (
        resDate.getFullYear() !== today.getFullYear() ||
        resDate.getMonth() !== today.getMonth() ||
        resDate.getDate() !== today.getDate()
      ) {
        return res.status(400).json({
          success: false,
          message: "Chỉ được nhận bàn cho đặt bàn trong ngày hôm nay",
        });
      }
      reservation.checkInTime = new Date();

      // Khi nhận bàn: cập nhật order → active, items pre-order → pending
      const order = await Order.findOne({ reservation: id });
      if (order) {
        order.orderStatus = "active";
        order.subOrders.forEach((sub) => {
          sub.items.forEach((item) => {
            if (item.status === "pre-order") {
              item.status = "pending";
            }
          });
        });
        await order.save();
      }
    }

    // nếu khách hoàn thành
    if (status === "completed") {
      reservation.checkOutTime = new Date();
    }

    // nếu hủy bàn
    if (status === "cancelled" && cancellationReason) {
      reservation.cancellationReason = cancellationReason;
    }

    await reservation.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái reservation thành công",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái reservation",
      error: error.message,
    });
  }
};

/**
 * PUT /api/reservations/:id
 * Cập nhật đặt bàn và gọi món
 */
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tables,
      items,
      orderMode,
      reservationDateTime,
      numberOfGuests,
      customer,
      note,
    } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Không tìm thấy reservation" });
    }

    // Kiểm tra số khách không vượt quá tổng số ghế
    const selectedTableDocs = await Table.find({ _id: { $in: tables } });
    const totalCapacity = selectedTableDocs.reduce((sum, t) => sum + (t.capacity || 0), 0);
    if (numberOfGuests > totalCapacity) {
      return res.status(400).json({
        success: false,
        message: `Số khách (${numberOfGuests}) vượt quá tổng số ghế (${totalCapacity})`,
      });
    }

    // Validate table availability, excluding this reservation
    const validation = await validateTablesForReservation(tables, reservationDateTime, id);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        tables: validation.tables,
      });
    }

    // Update reservation info
    reservation.reservationDateTime = reservationDateTime;
    reservation.numberOfGuests = numberOfGuests;
    reservation.tables = tables;
    reservation.customer = customer;
    reservation.note = note;
    await reservation.save();

    // Find and update Order
    let order = await Order.findOne({ reservation: id });
    if (!order) {
      order = new Order({ reservation: id, user: req.user?.id, orderStatus: "pre-order" });
    }

    let subOrders = [];
    if (!items || items.length === 0) {
      subOrders = tables.map((tableId) => ({ table: tableId, items: [], subTotalAmount: 0 }));
    } else {
      let menuItemIds = [];
      if (orderMode === "same") {
        menuItemIds = items.map((i) => i.menuItem);
      } else if (orderMode === "separate") {
        menuItemIds = items.flatMap((t) => t.items.map((i) => i.menuItem));
      }

      const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
      const menuMap = {};
      menuItems.forEach((menu) => (menuMap[menu._id.toString()] = menu));

      if (orderMode === "same") {
        for (const table of tables) {
          const orderItems = items.map((item) => {
            const menu = menuMap[item.menuItem];
            if (!menu) throw new Error(`Menu item không tồn tại: ${item.menuItem}`);
            return {
              menuItem: menu._id,
              itemName: menu.itemName,
              unitPrice: menu.price,
              quantity: item.quantity,
              note: item.note || "",
              status: "pre-order",
              subTotal: menu.price * item.quantity,
            };
          });
          subOrders.push({ table, items: orderItems, subTotalAmount: 0 });
        }
      } else if (orderMode === "separate") {
        for (const tableOrder of items) {
          if (!tables.includes(tableOrder.table)) {
            throw new Error("Table không hợp lệ trong order");
          }
          const orderItems = tableOrder.items.map((item) => {
            const menu = menuMap[item.menuItem];
            if (!menu) throw new Error(`Menu item không tồn tại: ${item.menuItem}`);
            return {
              menuItem: menu._id,
              itemName: menu.itemName,
              unitPrice: menu.price,
              quantity: item.quantity,
              note: item.note || "",
              status: "pre-order",
              subTotal: menu.price * item.quantity,
            };
          });
          subOrders.push({ table: tableOrder.table, items: orderItems, subTotalAmount: 0 });
        }
      }
    }

    order.subOrders = subOrders;

    // Calculate total explicitly before saving 
    let total = 0;
    order.subOrders.forEach(sub => {
      sub.subTotalAmount = sub.items.reduce((sum, item) => sum + (item.subTotal || 0), 0);
      total += sub.subTotalAmount;
    });
    order.totalAmount = total;
    order.finalAmount = total + (order.taxAmount || 0);

    await order.save();

    res.json({
      success: true,
      message: "Cập nhật đặt bàn thành công",
      reservation,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi cập nhật reservation",
      error: error.message,
    });
  }
};
