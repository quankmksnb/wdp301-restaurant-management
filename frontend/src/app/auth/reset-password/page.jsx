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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];

      pasted.forEach((num, i) => {
        if (index + i < 6) newOtp[index + i] = num;
      });

      setOtp(newOtp);
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

  const handleSendOtp = async () => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    toast.error("Nhập email trước");
    return;
  }

  if (!emailRegex.test(trimmedEmail)) {
    toast.error("Email không hợp lệ");
    return;
  }
  const toastId = toast.loading("Đang gửi OTP...");

  try {
    setLoading(true);
    const res = await sendOtp({ email: trimmedEmail });
    toast.success(res.data?.message || "OTP đã gửi!", { id: toastId });
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();

  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message, { id: toastId });
    } else {
      toast.error("Không thể kết nối server", { id: toastId });
    }
  }
  setLoading(false);
};

  const handleVerify = async (e) => {
    e.preventDefault();

    const fullOtp = otp.join("");
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (fullOtp.length !== 6) {
      toast.error("Nhập đủ 6 số OTP");
      return;
    }

    const toastId = toast.loading("Đang xác thực OTP...");

    try {
      setLoading(true);

      const res = await verifyOtp({
        email: trimmedEmail,
        otp: fullOtp,
      });

      toast.success("Xác thực OTP thành công!", { id: toastId });

      const token = res.data.resetToken;

      setTimeout(() => {
        router.push(`/auth/new-password?token=${token}`);
      }, 800);

    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 400);

      if (err.response) {
        toast.error(err.response.data.message, { id: toastId });
      } else {
        toast.error("Không thể kết nối server", { id: toastId });
      }
    }

    setLoading(false);
  };
  const handleKeyDown = (e, index) => {
    // backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        // nếu có giá trị → xóa tại ô hiện tại
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // nếu rỗng → nhảy về ô trước
        inputsRef.current[index - 1]?.focus();

        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }

    // ← →
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
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

          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-600 mb-3" />
            <h2 className="text-xl font-bold text-gray-800 text-center">
              Xác thực OTP
            </h2>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  disabled={countdown > 0}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Send OTP */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || countdown > 0}
              className="w-full text-sm bg-gray-700 hover:bg-gray-800 text-white py-2.5 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Đang gửi OTP..."
                : countdown > 0
                  ? `Gửi lại sau ${formatTime(countdown)}`
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
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-10 h-11 text-center text-sm font-semibold border rounded-lg"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm disabled:bg-gray-400"
            >
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}