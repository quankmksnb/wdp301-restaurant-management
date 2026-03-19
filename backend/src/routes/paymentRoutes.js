import express from "express";
import { payByCash } from "../controllers/paymentController.js";


const router = express.Router();

// Thanh toán tiền mặt
router.post("/cash/:orderId", payByCash);

export default router;