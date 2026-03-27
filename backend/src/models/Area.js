import mongoose from "mongoose";
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
    areaStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Area", areaSchema, "areas");
