import express from "express";
import {
    orderItems,
    cancelOrderItem,
    getCurrentOrderByTable,
    sendToKitchen,
    updateOrderItemQuantity
} from "../controllers/orderController.js";

const router = express.Router();


router.post("/items", orderItems);
router.patch("/cancel-item", cancelOrderItem);
router.patch("/send-to-kitchen", sendToKitchen);
router.patch("/update-item-quantity", updateOrderItemQuantity);
router.get("/table/:tableId", getCurrentOrderByTable);

export default router;