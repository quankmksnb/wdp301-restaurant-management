"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      const decoded = jwtDecode(data.token);

      const role = decoded.role;

      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (role === "manager") {
          router.push("/dashboard");
        } else if (role === "waiter") {
          router.push("/waiter");
        } else if (role === "receptionist") {
          router.push("/reception");
        } else if (role === "kitchenStaff") {
          router.push("/kitchen");
        }
      }, 1000);
    } catch (err) {
      setError("Không thể kết nối server");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <Image
        src="/images/login.jpg"
        alt="Login background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl px-8 py-9">

          {/* Header */}
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
              ThanhHoa Restaurant
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="thanhhoa@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/auth/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700
                         transition text-white py-2.5 rounded-lg font-semibold"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-7 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>Hỗ trợ 1900 6522</span>
            </div>
            <span>© ThanhHoa Restaurant</span>
          </div>
        </div>
      </div>
    </div>
  );
}