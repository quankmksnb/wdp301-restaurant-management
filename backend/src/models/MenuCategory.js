import mongoose from "mongoose";

const menuCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    description: String,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      default: null
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("MenuCategory", menuCategorySchema, "menuCategories");
