import express from "express";
import {
    addItemToTable,
    sendItemsToKitchen,
    cancelItem,
    getCurrentBillByTable,
    getOrderBill,
    getOrderByReservation
} from "../controllers/orderController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

// gọi món theo bàn
router.post("/:orderId/tables/:tableId/items", verifyToken, authorizeRoles("waiter"), addItemToTable);

// gửi món xuống bếp
router.patch("/:orderId/send-to-kitchen", verifyToken, authorizeRoles("waiter"), sendItemsToKitchen);

// hủy món
router.patch("/:orderId/items/:itemId/cancel", verifyToken, authorizeRoles("waiter"), cancelItem);

// lấy hóa đơn hiện tại của bàn
router.get("/table/:tableId/bill", getCurrentBillByTable);

router.get("/:orderId/bill", getOrderBill);

// lấy order theo reservation
router.get("/reservation/:reservationId", getOrderByReservation);

export default router;