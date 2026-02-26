import Area from "./Area.js"
const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    tableStatus: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
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
