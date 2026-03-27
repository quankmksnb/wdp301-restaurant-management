// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["payment", "reservation", "order", "system"] },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 24 * 60 * 60,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Activity", activitySchema, "activities");
