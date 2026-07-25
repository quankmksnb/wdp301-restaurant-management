"use client";

import { loginUser } from "@/services/userService";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Phone, UserCheck } from "lucide-react"; // Thêm UserCheck cho icon demo
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const demoAccounts = {
    manager: { email: "quanly@demo.com", pass: "123456" },
    receptionist: { email: "letan@demo.com", pass: "123456" },
    waiter: { email: "phucvu@demo.com", pass: "123456" },
    kitchen: { email: "nhabep@demo.com", pass: "123456" },
  };

  useEffect(() => {
    if (lockTime <= 0) return;
    const timer = setInterval(() => {
      setLockTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockTime]);

  const handleQuickLogin = (role) => {
    const account = demoAccounts[role];
    setEmail(account.email);
    setPassword(account.pass);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleLogin(fakeEvent, account.email, account.pass);
    }, 100);
  };

  const handleLogin = async (e, quickEmail, quickPass) => {
    e?.preventDefault();

    const finalEmail = (quickEmail || email).trim();
    const finalPassword = (quickPass || password).trim();

    if (!finalEmail || !finalPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (lockTime > 0) {
      toast.error(`Bạn đang bị khóa. Thử lại sau ${lockTime}s`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser({
        email: finalEmail,
        password: finalPassword,
      });

      const data = res.data;
      localStorage.setItem("token", data.token);

      const decoded = jwtDecode(data.token);
      const role = decoded.role;

      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (role === "manager") router.push("/dashboard");
        else if (role === "waiter") router.push("/waiter");
        else if (role === "receptionist") router.push("/reception");
        else if (role === "kitchenStaff") router.push("/kitchen");
      }, 1000);
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message;
        setError(message);
        toast.error(message);
        if (err.response.status === 429) {
          const match = message.match(/\d+/);
          if (match) setLockTime(parseInt(match[0]));
        }
      } else {
        setError("Không thể kết nối server");
        toast.error("Không thể kết nối server");
      }
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen">
      <Image
        src="/images/login.jpg"
        alt="Login background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl px-8 py-9">
          <div className="flex flex-col items-center mb-7">
            <Image
              src="/images/logo.png"
              alt="Restaurant Logo"
              width={72}
              height={72}
            />
            <span className="mt-4 text-xs tracking-widest text-gray-500 uppercase">
              Welcome to
            </span>
            <h1 className="mt-1 text-2xl font-bold text-gray-800 text-center leading-tight">
              ThanHoa Restaurant
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="thanhhoa@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {lockTime > 0 && (
              <p className="text-red-500 text-sm text-center">
                Thử lại sau {formatTime(lockTime)}
              </p>
            )}

            <div className="text-right">
              <Link
                href="/auth/reset-password"
                name="reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || lockTime > 0}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {lockTime > 0
                ? `Thử lại sau ${formatTime(lockTime)}`
                : loading
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}
            </button>
          </form>

          {/* --- PHẦN ĐĂNG NHẬP DEMO --- */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">
                Đăng nhập Demo
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              onClick={() => handleQuickLogin("manager")}
              className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
            >
              <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-600">
                QUẢN LÝ
              </span>
            </button>
            <button
              onClick={() => handleQuickLogin("receptionist")}
              className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
            >
              <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-600">
                LỄ TÂN
              </span>
            </button>
            <button
              onClick={() => handleQuickLogin("waiter")}
              className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
            >
              <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-600">
                PHỤC VỤ
              </span>
            </button>
            <button
              onClick={() => handleQuickLogin("kitchen")}
              className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group"
            >
              <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-600">
                NHÀ BẾP
              </span>
            </button>
          </div>

          <div className="mt-7 flex items-center justify-between text-xs text-gray-500 border-t pt-4">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>Hỗ trợ 0981228204</span>
            </div>
            <span>© ThanHoa Restaurant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
