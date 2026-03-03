import express from "express";
import menuCategoryRoutes from "./menuCategoryRoutes.js";
import menuItemRoutes from "./menuItemRoutes.js";

const router = express.Router();

router.use("/menu-categories", menuCategoryRoutes);
router.use("/menu-items", menuItemRoutes);

export default router;