import Customer from "./Customer.js";
import Table from "./Table.js";
import User from "./User.js";
const reservationSchema = new mongoose.Schema(
  {
    reservationDateTime: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Reservation", reservationSchema);
