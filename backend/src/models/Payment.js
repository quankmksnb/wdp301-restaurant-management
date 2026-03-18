import mongoose from "mongoose";
import Order from "./Order.js";
import User from "./User.js";

const paymentSchema = new mongoose.Schema(
  {
    // Liên kết với đơn hàng
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Số tiền khách cần thanh toán
    amount: {
      type: Number,
      required: [true, "Số tiền thanh toán là bắt buộc"],
      min: [0, "Số tiền không được âm"],
    },

    // Tiền khách đưa (chỉ dùng cho CASH)
    cashReceived: {
      type: Number,
      min: 0,
    },

    // Tiền trả lại khách
    change: {
      type: Number,
      min: 0,
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      enum: [
        "cash", // Tiền mặt
        "card", // Thẻ ngân hàng (POS)
        "transfer", // Chuyển khoản (QR Code/E-wallet)
      ],
      required: true,
    },

    // Trạng thái giao dịch
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Thông tin giao dịch từ bên thứ 3 (Mã tham chiếu ngân hàng, mã ví điện tử)
    transactionId: {
      type: String,
      trim: true,
    },

    // Thời điểm thanh toán thực tế
    paymentDate: { type: Date, default: Date.now },

    // Nhân viên thực hiện thu tiền
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Bắt buộc để biết ai chịu trách nhiệm về số tiền này
    },

    // Ghi chú (Ví dụ: khách chuyển khoản thiếu, hoặc tip thêm)
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

// Index để tìm kiếm lịch sử thanh toán của một đơn hàng nhanh chóng
paymentSchema.index({ order: 1 });

// Index phục vụ báo cáo doanh thu theo ngày/tháng
paymentSchema.index({ paymentDate: -1, paymentStatus: 1 });


export default mongoose.model("Payment", paymentSchema);
