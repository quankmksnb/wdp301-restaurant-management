import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    // Liên kết với đơn hàng
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // Số tiền khách thanh toán (Có thể khác amount của Order nếu thanh toán nhiều đợt)
    amount: {
      type: Number,
      required: [true, "Số tiền thanh toán là bắt buộc"],
      min: [0, "Số tiền không được âm"],
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

// Middleware: Khi thanh toán thành công, tự động cập nhật trạng thái Order
paymentSchema.post("save", async function (doc) {
  if (doc.paymentStatus === "completed") {
    await mongoose.model("Order").findByIdAndUpdate(doc.order, {
      orderStatus: "completed",
    });

    // Lưu ý: Nếu đơn hàng gắn với Reservation, bạn có thể cần cập nhật
    // luôn Reservation sang "completed" tại đây thông qua Order.
  }
});

export default mongoose.model("Payment", paymentSchema);
