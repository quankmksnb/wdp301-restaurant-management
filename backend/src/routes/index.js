import express from "express";
import menuCategoryRoutes from "./menuCategoryRoutes.js";
import menuItemRoutes from "./menuItemRoutes.js";
import userRoutes from "./userRoutes.js";
import areaRoutes from "./areaRoutes.js";
import tableRoutes from "./tableRoutes.js";
import reservationRoutes from "./reservationRoutes.js";
import orderRoutes from "./orderRoutes.js";

const router = express.Router();

router.use("/menu-categories", menuCategoryRoutes);
router.use("/menu-items", menuItemRoutes);
router.use("/orders", orderRoutes);

// base path: /api/users
router.use("/users", userRoutes);

router.use("/areas", areaRoutes);
router.use("/tables", tableRoutes);
router.use("/reservations", reservationRoutes);

export default router;
