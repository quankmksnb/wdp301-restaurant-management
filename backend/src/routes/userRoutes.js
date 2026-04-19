import express from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";
import checkDemoMode from "../middlewares/checkDemoMode.js";

const router = express.Router();

router.post("/login", login);
router.post("/send-otp", checkDemoMode, sendOtp);
router.post("/verify-otp", checkDemoMode, verifyOtp);
router.post("/reset-password", checkDemoMode, resetPassword);

export default router;
