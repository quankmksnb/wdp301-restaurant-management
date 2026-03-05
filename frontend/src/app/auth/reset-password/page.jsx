"use client";

import { sendOtp, verifyOtp } from "@/services/userService";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];

      pasted.forEach((num, i) => {
        if (index + i < 6) {
          newOtp[index + i] = num;
        }
      });

      setOtp(newOtp);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSendOtp = async () => {
  if (!email) return toast.error("Nhập email trước");

  try {
    setLoading(true);

    await sendOtp({ email });

    toast.success("OTP đã gửi!");
    setCountdown(60);
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Không thể kết nối server");
    }
  }

  setLoading(false);
};

  const handleVerify = async (e) => {
  e.preventDefault();

  const fullOtp = otp.join("");

  if (fullOtp.length !== 6)
    return toast.error("Nhập đủ 6 số OTP");

  try {
    setLoading(true);

    await verifyOtp({
      email,
      otp: fullOtp,
    });

    toast.success("OTP hợp lệ!");

    setTimeout(() => {
      router.push(`/auth/new-password?email=${email}`);
    }, 1000);
  } catch (err) {
    setShake(true);
    setTimeout(() => setShake(false), 400);

    if (err.response) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Không thể kết nối server");
    }
  }

  setLoading(false);
};

  return (
    <div className="relative min-h-screen">
      <Image
        src="/images/login.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl px-8 py-9">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-600 mb-3" />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Xác thực OTP
            </h2>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Send OTP */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || countdown > 0}
              className="w-full text-sm bg-gray-700 hover:bg-gray-800
                         transition text-white py-2.5 rounded-lg disabled:opacity-50"
            >
              {countdown > 0
                ? `Gửi lại sau ${countdown}s`
                : "Gửi OTP"}
            </button>

            {/* OTP */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Nhập OTP
              </label>

              <div className={`flex justify-between gap-2 ${shake ? "animate-shake" : ""}`}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-11 text-center text-sm font-semibold
                               border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* Verify */}
            <button
              type="submit"
              disabled={loading}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700
                         transition text-white py-2.5 rounded-lg font-semibold text-sm"
            >
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}