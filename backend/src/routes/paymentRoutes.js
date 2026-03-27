import express from "express";
import { payByCash, vnpayReturn, createPayment } from "../controllers/paymentController.js";


const router = express.Router();

// Thanh toán tiền mặt
router.post("/cash/:orderId", payByCash);

// Thanh toán VNPAY
router.post("/vnpay-create", createPayment);
router.get("/vnpay-return", vnpayReturn);

export default router;