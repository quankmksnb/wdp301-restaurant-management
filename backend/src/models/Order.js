import mongoose from "mongoose";
import Customer from "./Customer.js";
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
    quantity: { type: Number, required: true },
    subTotal: Number,
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

    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
