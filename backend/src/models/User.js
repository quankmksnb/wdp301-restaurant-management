import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["receptionist", "waiter", "manager", "kitchenStaff"],
      required: true,
    },
    phone: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema, "users");
