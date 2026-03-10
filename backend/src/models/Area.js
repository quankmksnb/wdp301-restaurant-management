import mongoose from "mongoose";
import User from "./User.js";
const areaSchema = new mongoose.Schema(
  {
    areaName: {
      type: String,
      required: [true, "Tên khu vực là bắt buộc"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Area", areaSchema, "areas");
