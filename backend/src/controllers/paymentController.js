import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// Thanh toán tiền mặt
export const payByCash = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, cashReceived, change, user } = req.body;

    // 0. Check user
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID là bắt buộc",
      });
    }

    // 1. Check order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order không tồn tại",
      });
    }

    // 2. Check đã thanh toán chưa
    if (order.orderStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Order đã được thanh toán",
      });
    }

    // 3. Validate tiền
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

    // 4. Tạo payment
    const payment = await Payment.create({
      order: orderId,
      amount,
      cashReceived,
      change,
      paymentMethod: "cash",
      paymentStatus: "completed",
      user: user,
    });

    // 🔥 5. Update orderStatus
    order.orderStatus = "completed";
    await order.save();

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