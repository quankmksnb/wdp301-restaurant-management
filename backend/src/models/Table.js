import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: [true, "Tên bàn là bắt buộc"],
      trim: true,
    },
    tableNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
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

tableSchema.index({ tableName: 1, area: 1 }, { unique: true });

export default mongoose.model("Table", tableSchema, "tables");
