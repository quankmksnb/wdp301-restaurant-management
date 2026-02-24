import User from "./User.js";
const areaSchema = new mongoose.Schema(
  {
    areaName: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Area", areaSchema, "areas");
