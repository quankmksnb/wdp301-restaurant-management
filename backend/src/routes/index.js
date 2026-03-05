import express from "express";
import userRoutes from "./userRoutes.js";
import menuCategoryRoutes from "./menuCategoryRoutes.js";

const router = express.Router();

// base path: /api/users
router.use("/users", userRoutes);
router.use("/menu-categories", menuCategoryRoutes);
router.use("/menu-items", menuItemRoutes);

export default router;