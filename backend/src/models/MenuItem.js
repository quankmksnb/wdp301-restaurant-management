import MenuCategory from "./MenuCategory.js";
const menuItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    productCode: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    availabilityStatus: {
      type: String,
      enum: ["available", "out_of_stock"],
      default: "available",
    },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("MenuItem", menuItemSchema, "menuItems");
