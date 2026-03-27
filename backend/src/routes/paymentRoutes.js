import express from "express";
import { payByCash, vnpayReturn, createPayment } from "../controllers/paymentController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";



const router = express.Router();

// Thanh toán tiền mặt
router.post("/cash/:orderId", verifyToken, authorizeRoles("waiter"), payByCash);

// Thanh toán VNPAY
router.post("/vnpay-create", verifyToken, authorizeRoles("waiter"), createPayment);
router.get("/vnpay-return", vnpayReturn);

export default router;