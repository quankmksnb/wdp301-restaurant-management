import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

dotenv.config();

const otpStore = {};
const loginAttempts = {};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const MAX_ATTEMPTS = 5;
    const LOCK_TIME = 3 * 60 * 1000;

    const attempt = loginAttempts[email];

    if (attempt && attempt.count >= MAX_ATTEMPTS) {
      if (Date.now() < attempt.lockUntil) {
        const remaining = Math.ceil(
          (attempt.lockUntil - Date.now()) / 1000
        );
        return res.status(429).json({
          message: `Bạn đã nhập sai quá nhiều lần. Thử lại sau ${remaining}s`,
        });
      } else {
        delete loginAttempts[email];
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu sai",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Tài khoản bị khóa",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      if (!loginAttempts[email]) {
        loginAttempts[email] = { count: 0 };
      }

      loginAttempts[email].count++;

      if (loginAttempts[email].count >= MAX_ATTEMPTS) {
        loginAttempts[email].lockUntil = Date.now() + LOCK_TIME;
      }

      return res.status(401).json({
        message: "Email hoặc mật khẩu sai",
      });
    }

    delete loginAttempts[email];

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      fullName: user.fullName,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
};

// ================= SEND OTP =================
export const sendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    email = email?.trim();

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email không hợp lệ",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email không tồn tại",
      });
    }

    const existing = otpStore[email];
    if (existing && Date.now() < existing.createdAt + 60 * 1000) {
      const remaining = Math.ceil(
        (existing.createdAt + 60 * 1000 - Date.now()) / 1000
      );
      return res.status(429).json({
        message: `Vui lòng đợi ${remaining}s để gửi lại OTP`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore[email] = {
      otp: hashedOtp,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      createdAt: Date.now(),
    };

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP đã gửi qua email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Send OTP error" });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email?.trim();
    otp = otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Thiếu thông tin",
      });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({
        message: "Chưa gửi OTP",
      });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({
        message: "OTP hết hạn",
      });
    }

    if (record.attempts >= 5) {
      delete otpStore[email];
      return res.status(400).json({
        message: "OTP sai quá nhiều lần",
      });
    }

    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
      record.attempts++;
      return res.status(400).json({
        message: "OTP không đúng",
      });
    }

    // TẠO TOKEN RESET PASSWORD
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    delete otpStore[email];

    res.json({
      message: "OTP hợp lệ",
      resetToken,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verify OTP error" });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    let { token, newPassword, confirmPassword } = req.body;

    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Thiếu thông tin",
      });
    }

    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ và số",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu không khớp",
      });
    }

    // VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    const email = decoded.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User không tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: "Đổi mật khẩu thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset password error" });
  }
};