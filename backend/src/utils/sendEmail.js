import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>Expires in 5 minutes.</p>
    `,
  });
};