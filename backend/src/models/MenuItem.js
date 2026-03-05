import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    productCode: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: String,
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "out_of_stock"],
      default: "available",
    },
    images: [{ type: String }],
    costPrice: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
  },
  { timestamps: true }
);

// Search
menuItemSchema.index({
  itemName: "text",
  productCode: "text",
});

// Filter
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ availabilityStatus: 1 });

// Compound filter
menuItemSchema.index({ category: 1, availabilityStatus: 1 });

// Sort
menuItemSchema.index({ createdAt: -1 });

export default mongoose.model("MenuItem", menuItemSchema, "menuItems");