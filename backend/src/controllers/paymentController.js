import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Reservation from "../models/Reservation.js";
import { VNPay, ProductCode, VnpLocale, dateFormat } from "vnpay";
import vnpayConfig from "../configs/vnpay.js";
import { logActivity } from "../utils/activityLogger.js";

const { vnp_TmnCode, vnp_HashSecret, vnp_ReturnUrl } = vnpayConfig;

// ✅ Khởi tạo VNPay instance
const vnpay = new VNPay({
  tmnCode: vnp_TmnCode,
  secureSecret: vnp_HashSecret,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
});

// ─── Thanh toán VNPay ────────────────────────────────────────────────────────
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, user } = req.body;

    if (!user)
      return res.status(400).json({ success: false, message: "User ID là bắt buộc" });
    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: "Số tiền không hợp lệ" });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order không tồn tại" });
    if (order.orderStatus === "completed")
      return res.status(400).json({ success: false, message: "Order đã thanh toán" });

    // ✅ Tính lại amount từ items đã phục vụ thực tế
    const billableStatuses = ["preparing", "ready", "served"];
    let calculatedAmount = 0;
    order.subOrders.forEach((sub) => {
      sub.items.forEach((item) => {
        if (billableStatuses.includes(item.status)) {
          calculatedAmount += item.subTotal || item.unitPrice * item.quantity;
        }
      });
    });

    if (amount !== calculatedAmount) {
      return res.status(400).json({
        success: false,
        message: `Số tiền không khớp: server tính ${calculatedAmount}, client gửi ${amount}`,
      });
    }

    // ✅ TxnRef unique tránh VNPay reject lần thử lại
    const txnRef = `${orderId}-${Date.now()}`;

    // ✅ Tránh duplicate payment
    let payment = await Payment.findOne({
      order: orderId,
      paymentMethod: "transfer",
      paymentStatus: "pending",
    });
    if (!payment) {
      payment = await Payment.create({
        order: orderId,
        amount,
        paymentMethod: "transfer",
        paymentStatus: "pending",
        user,
        transactionId: txnRef,
      });
    } else {
      payment.transactionId = txnRef;
      await payment.save();
    }

    const rawIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const ipAddr = rawIp.replace("::ffff:", "").replace("::1", "127.0.0.1");

    // ✅ Dùng thư viện vnpay — tự sort, encode, ký
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanhtoan${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000)),
    });

    return res.json({ success: true, paymentUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── VNPay Return ────────────────────────────────────────────────────────────
export const vnpayReturn = async (req, res) => {
  try {
    // ✅ Thư viện tự verify chữ ký
    const verify = vnpay.verifyReturnUrl(req.query);

    const txnRef = req.query.vnp_TxnRef;
    const orderId = txnRef.split("-")[0];

    if (!verify.isVerified || !verify.isSuccess) {
      return res.redirect(
        `http://localhost:3000/payment-result?status=fail&orderId=${orderId}`
      );
    }

    const payment = await Payment.findOne({ transactionId: txnRef });
    const order = await Order.findById(orderId);

    if (!payment || !order) {
      return res.redirect(
        `http://localhost:3000/payment-result?status=fail&orderId=${orderId}`
      );
    }

    // Tránh xử lý lại nếu đã completed
    if (payment.paymentStatus === "completed") {
      return res.redirect(
        `http://localhost:3000/payment-result?status=success&orderId=${orderId}`
      );
    }

    payment.paymentStatus = "completed";
    payment.vnpayResponse = req.query;
    payment.transactionId = req.query.vnp_TransactionNo || txnRef;
    await payment.save();

    order.orderStatus = "completed";
    await order.save();

    // Log activities
    await logActivity(
      payment.user, 
      `vừa thanh toán đơn [${orderId}] qua VNPay - ${payment.amount.toLocaleString()}đ`, 
      "payment"
    );

    const reservation = await Reservation.findById(order.reservation);
    if (reservation) {
      reservation.status = "completed";
      reservation.checkOutTime = new Date();
      await reservation.save();
    }

    return res.redirect(
      `http://localhost:3000/payment-result?status=success&orderId=${orderId}`
    );
  } catch (error) {
    return res.redirect(`http://localhost:3000/payment-result?status=error`);
  }
};

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

    // Log activities
    await logActivity(
      user, 
      `vừa thanh toán tiền mặt cho đơn [${orderId}] - ${amount.toLocaleString()}đ`, 
      "payment"
    );

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