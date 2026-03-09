import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

dotenv.config();

const otpStore = {};

console.log("Auth controller loaded");

//login
export const login = async (req, res) => {
  try {
    console.log("Login request received");
    console.log("Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "NOT FOUND");

    if (!user) {
      console.log("Login failed - user not found");
      return res.status(401).json({ message: "Email hoặc mật khẩu sai" });
    }

    if (user.status !== "active") {
      console.log("Login blocked - account inactive");
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Login failed - wrong password");
      return res.status(401).json({ message: "Email hoặc mật khẩu sai" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Login success:", user.email);
    console.log("Role:", user.role);

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

//send OTP
export const sendOtp = async (req, res) => {
  try {
    console.log("Send OTP request received");
    console.log("Body:", req.body);

    const { email } = req.body;

    if (!email) {
      console.log("Email missing");
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? "YES" : "NO");

    if (!user) {
      console.log("Email not found in database");
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      verified: false,
    };

    console.log("OTP stored in memory:", otpStore[email]);

    await sendOTPEmail(email, otp);
    console.log("OTP email sent to:", email);

    res.json({ message: "OTP đã gửi qua email" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Send OTP error" });
  }
};

//verify OTP
export const verifyOtp = (req, res) => {
  console.log("Verify OTP request received");
  console.log("Body:", req.body);

  const { email, otp } = req.body;

  const record = otpStore[email];
  console.log("OTP record:", record);

  if (!record) {
    console.log("No OTP record found");
    return res.status(400).json({ message: "Chưa gửi OTP" });
  }

  if (Date.now() > record.expires) {
    console.log("OTP expired");
    delete otpStore[email];
    return res.status(400).json({ message: "OTP hết hạn" });
  }

  if (record.otp !== otp) {
    console.log("OTP incorrect");
    return res.status(400).json({ message: "OTP không đúng" });
  }

  record.verified = true;
  console.log("OTP verified successfully");

  res.json({ message: "OTP hợp lệ" });
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    console.log("Reset password request received");
    console.log("Body:", req.body);

    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      console.log("Missing required fields");
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (newPassword.length < 6) {
      console.log("Password too short");
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }

    if (newPassword !== confirmPassword) {
      console.log("Password confirmation mismatch");
      return res.status(400).json({
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    const record = otpStore[email];
    console.log("OTP record for reset:", record);

    if (!record || !record.verified) {
      console.log("OTP not verified");
      return res.status(400).json({
        message: "Chưa xác thực OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Password hashed");

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    console.log("Password updated in database");

    delete otpStore[email];
    console.log("OTP record deleted from memory");

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Reset password error" });
  }
};