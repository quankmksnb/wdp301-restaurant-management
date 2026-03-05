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
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
  e.preventDefault();

  if (!newPassword || !confirmPassword)
    return toast.error("Vui lòng nhập đầy đủ");

  if (newPassword.length < 6)
    return toast.error("Mật khẩu phải ít nhất 6 ký tự");

  if (newPassword !== confirmPassword)
    return toast.error("Mật khẩu không khớp");

  try {
    const res = await resetPassword({
      email,
      newPassword,
      confirmPassword,
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

            <div>
              <label className="block text-sm mb-1">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg"
            >
              Đổi mật khẩu
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}