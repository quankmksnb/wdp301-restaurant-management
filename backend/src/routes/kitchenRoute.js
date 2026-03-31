import express from "express";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import {
  getOrderItemsByPriority,
  getOrderItemsByDish,
  getOrderItemsByTable,
  getReadyToServeItems,
  updateItemStatus,
  updateBulkItemStatus,
} from "../controllers/kitchenController.js";

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles("kitchenStaff"));

router.get("/pending", getOrderItemsByPriority);
router.get("/ready", getReadyToServeItems);
router.get("/by-dish", getOrderItemsByDish);
router.get("/by-table", getOrderItemsByTable);
router.patch("/item/:orderItemId/status", updateItemStatus);
router.patch("/bulk-update", updateBulkItemStatus);

export default router;
