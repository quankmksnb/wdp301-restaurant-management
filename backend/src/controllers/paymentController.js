import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Reservation from "../models/Reservation.js";

// Thanh toán tiền mặt
export const payByCash = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, cashReceived, change, user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID là bắt buộc",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    if (order.orderStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order đã được thanh toán",
      });
    }

    if (amount < 0 || cashReceived < 0 || change < 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu tiền không hợp lệ",
      });
    }

    if (cashReceived < amount) {
      return res.status(400).json({
        success: false,
        message: "Tiền khách đưa không đủ",
      });
    }

    // ✅ tạo payment
    const payment = await Payment.create({
      order: orderId,
      amount,
      cashReceived,
      change,
      paymentMethod: "cash",
      paymentStatus: "completed",
      user: user,
    });

    // ✅ update order
    order.orderStatus = "completed";
    await order.save();

    // 🔥 update reservation
    const reservation = await Reservation.findById(order.reservation);

    if (reservation) {
      reservation.status = "completed";
      reservation.checkOutTime = new Date(); // rất quan trọng
      await reservation.save();
    }

    return res.status(201).json({
      success: true,
      message: "Thanh toán tiền mặt thành công",
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};