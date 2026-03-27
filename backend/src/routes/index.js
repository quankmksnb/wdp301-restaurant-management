import express from "express";
import menuCategoryRoutes from "./menuCategoryRoutes.js";
import menuItemRoutes from "./menuItemRoutes.js";
import userRoutes from "./userRoutes.js";
import areaRoutes from "./areaRoutes.js";
import tableRoutes from "./tableRoutes.js";
import orderRoutes from "./orderRoutes.js";
import reservationRoutes from "./reservationRoutes.js";
import kitchenRoutes from "./kitchenRoute.js";
import paymentRoutes from "./paymentRoutes.js";
import employeeRoutes from "./employeeRoutes.js";
import exportRoutes from "./exportRoutes.js";

const router = express.Router();

router.use("/menu-categories", menuCategoryRoutes);
router.use("/menu-items", menuItemRoutes);
router.use("/payments", paymentRoutes);
router.use("/orders", orderRoutes);

// base path: /api/users
router.use("/users", userRoutes);

router.use("/areas", areaRoutes);
router.use("/tables", tableRoutes);
router.use("/reservations", reservationRoutes);

// kitchen
router.use("/kitchen", kitchenRoutes);

// employee
router.use("/employees", employeeRoutes);

// export
router.use("/export", exportRoutes);

export default router;
