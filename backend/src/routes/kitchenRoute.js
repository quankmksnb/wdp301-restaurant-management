import express from "express";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import {
  getOrderItemPending,
  getOrderItemsByDish,
  getOrderItemsByTable,
  getReadyToServeItems,
  updateItemStatus,
} from "../controllers/kitchenController.js";

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles("kitchenStaff", "admin"));

router.get("/pending", getOrderItemPending);
router.get("/ready", getReadyToServeItems);
router.get("/by-dish", getOrderItemsByDish);
router.get("/by-table", getOrderItemsByTable);
router.patch("/item/:orderItemId/status", updateItemStatus);

export default router;
