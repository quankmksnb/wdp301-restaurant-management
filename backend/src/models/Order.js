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
    orderItemStatus: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled", "out_of_stock"],
      default: "pending",
    },
    unitPrice: Number,
    quantity: { type: Number, required: true },
    subTotal: Number,
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    orderDate: { type: Date, default: Date.now },
    orderStatus: {
      type: String,
      enum: ["open", "completed", "cancelled"],
      default: "open"
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
