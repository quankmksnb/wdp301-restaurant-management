import mongoose from "mongoose";
import MenuItem from "./MenuItem.js";
import User from "./User.js";
import Table from "./Table.js";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    itemName: String,
    unitPrice: Number,
    // Số lượng món
    quantity: { type: Number, required: true, min: 1 },
    // Ghi chú món (ví dụ: không cay, ít đường)
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "pending", // Mới đặt, chờ bếp xác nhận
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
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderDate: { type: Date, default: Date.now },

    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "served", "completed", "cancelled"],
      default: "pending",
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, default: 0 },
    customer: { type: Object },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
