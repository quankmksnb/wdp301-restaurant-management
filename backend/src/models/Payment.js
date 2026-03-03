import Order from "./Order.js";
import User from "./User.js";
const paymentSchema = new mongoose.Schema(
  {
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
