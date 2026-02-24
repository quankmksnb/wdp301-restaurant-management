const menuCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("MenuCategory", menuCategorySchema, "menuCategories");
