"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Bạn chưa đăng nhập!");
      setTimeout(() => router.push("/"), 1500);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // token hết hạn
      if (decoded.exp * 1000 < Date.now()) {
        toast.error("Phiên đăng nhập đã hết hạn!");
        localStorage.removeItem("token");
        setTimeout(() => router.push("/"), 1500);
        return;
      }

      // sai role
      if (role && decoded.role !== role) {
        toast.error("Bạn không có quyền truy cập trang này!");
        setTimeout(() => router.push("/"), 1500);
        return;
      }

      setAuthorized(true);
    } catch (err) {
      toast.error("Token không hợp lệ!");
      localStorage.removeItem("token");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [router, role]);

  if (!authorized) return null;

  return children;
}