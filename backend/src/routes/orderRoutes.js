import express from "express";
import {
    addItemToTable,
    sendItemsToKitchen,
    cancelItem,
    getCurrentBillByTable,
    getOrderBill
} from "../controllers/orderController.js";

const router = express.Router();

// gọi món theo bàn
router.post("/:orderId/tables/:tableId/items", addItemToTable);

// gửi món xuống bếp
router.patch("/:orderId/send-to-kitchen", sendItemsToKitchen);

// hủy món
router.patch("/:orderId/items/:itemId/cancel", cancelItem);

// lấy hóa đơn hiện tại của bàn
router.get("/table/:tableId/bill", getCurrentBillByTable);

router.get("/:orderId/bill", getOrderBill);

export default router;