"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentResult() {
  const params = useSearchParams();
  const router = useRouter();

  const status = params.get("status");
  const orderId = params.get("orderId");

  const [message, setMessage] = useState("Đang xử lý...");

  useEffect(() => {
    if (!status) return;

    if (status === "success") {
      setMessage("🎉 Thanh toán thành công!");
    } else if (status === "fail") {
      setMessage("❌ Thanh toán thất bại!");
    } else {
      setMessage("⚠️ Có lỗi xảy ra!");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">{message}</h1>

      {orderId && (
        <p className="text-gray-500">Mã đơn: {orderId}</p>
      )}

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push("/waiter")}
      >
        Quay về
      </button>
    </div>
  );
}