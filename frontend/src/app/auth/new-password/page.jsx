"use client";

import { resetPassword } from "@/services/userService";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const handleReset = async (e) => {
    e.preventDefault();

    const newPass = newPassword.trim();
    const confirmPass = confirmPassword.trim();

    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    if (!newPass || !confirmPass) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!strongPasswordRegex.test(newPass)) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự, gồm chữ và số");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        newPassword: newPass,
        confirmPassword: confirmPass,
      });

      toast.success("Đổi mật khẩu thành công!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
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

          <h2 className="text-2xl font-bold text-center mb-6">
            Đặt lại mật khẩu
          </h2>

          <form onSubmit={handleReset} className="space-y-4">

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}