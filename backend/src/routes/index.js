import express from "express";
import menuCategoryRoutes from "./menuCategoryRoutes.js";
import menuItemRoutes from "./menuItemRoutes.js";
import userRoutes from "./userRoutes.js";
import areaRoutes from "./areaRoutes.js";

const router = express.Router();

router.use("/menu-categories", menuCategoryRoutes);
router.use("/menu-items", menuItemRoutes);

// base path: /api/users
router.use("/users", userRoutes);

router.use("/areas", areaRoutes);

export default router;
