import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: [true, "Tên bàn là bắt buộc"],
      trim: true,
    },
    tableNumber: { type: Number },
    capacity: { type: Number, required: true },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    tableStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Table", tableSchema, "tables");
