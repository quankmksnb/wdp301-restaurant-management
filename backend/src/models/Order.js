import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    // Lưu snapshot tên món tại thời điểm đặt (tránh việc menu đổi tên)
    itemName: String,
    // Snapshot giá món
    unitPrice: Number,
    // Số lượng món
    quantity: { type: Number, required: true, min: 1 },
    // Ghi chú món (ví dụ: không cay, ít đường)
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pre-order", // Món được đặt trước khi khách đến
        "pending", // Mới đặt, chờ bếp xác nhận
        "order_sent", // Đã gửi bếp, chờ bếp nhận
        "preparing", // Bếp đang làm
        "ready", // Đã xong, chờ nhân viên bưng ra
        "served", // Đã phục vụ khách tại bàn
        "cancelled", // Món bị hủy (hết nguyên liệu, khách đổi ý)
        "out_of_stock",
      ],
      default: "pending",
    },
    subTotal: { type: Number, required: true },
  },
  { _id: true, timestamps: true }, // Để _id để dễ dang cập nhật từng món
);

const orderSchema = new mongoose.Schema(
  {
    // Liên kết với Reservation
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

    // Trạng thái tổng quát của đơn hàng
    orderStatus: {
      type: String,
      enum: [
        "pre-order", // Khách đặt trước món khi chưa đến
        "active", // Khách đã nhận bàn (Reservation seated), đang gọi thêm/ăn uống
        "completed", // Đã thanh toán xong
        "cancelled", // Hủy đơn hàng
      ],
      default: "pre-order",
    },

    // Danh sách đơn con theo từng bàn
    subOrders: [
      {
        table: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Table",
          required: true,
        },
        items: [orderItemSchema],
        subTotalAmount: { type: Number, default: 0 }, // Tổng tiền riêng cho từng bàn
      },
    ],
    // Tổng tiền
    totalAmount: { type: Number, default: 0 },

    orderDate: { type: Date, default: Date.now },

    // Người tạo đơn
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Thuế hoặc phí dịch vụ nếu có
    taxAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Index để tìm nhanh đơn hàng của một lượt đặt bàn
orderSchema.index({ reservation: 1 });

// Middleware tính toán lại tổng tiền trước khi save
orderSchema.pre("save", function () {
  let total = 0;

  this.subOrders.forEach((sub) => {
    // ✅ Dùng subTotal (đã được tính khi add item)
    sub.subTotalAmount = sub.items.reduce((sum, item) => {
      if (item.status === "cancelled" || item.status === "out_of_stock") {
        return sum;
      }
      return sum + (item.subTotal || 0);
    }, 0);
    total += sub.subTotalAmount;
  });

  this.totalAmount = total;
  this.finalAmount = total + (this.taxAmount || 0);
});

export default mongoose.model("Order", orderSchema);
