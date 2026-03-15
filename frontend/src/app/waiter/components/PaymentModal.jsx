"use client";

import { Calendar, Clock, MoreVertical, User } from "lucide-react";
import { useState } from "react";

export default function PaymentModal({
  open,
  onClose,
  total,
  fmt,
  selTable,
  floorLabel,
  orderNumber = "3-14",
  items = [],
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerPaid, setCustomerPaid] = useState(total);

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${now.getFullYear()}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  const change = Math.max(0, customerPaid - total);

  // Merge items cùng itemName + unitPrice
  const mergedItems = items.reduce((acc, item) => {
    const existing = acc.find(
      (i) => i.itemName === item.itemName && i.unitPrice === item.unitPrice
    );
    if (existing) {
      existing.quantity += item.quantity;
      existing.subTotal += item.subTotal;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const quickAmounts = [
    total,
    Math.ceil(total / 1000) * 1000 + 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
    Math.ceil(total / 50000) * 50000,
    200000,
    500000,
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i && v >= total)
    .slice(0, 6);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`
          absolute right-0 top-0 h-full
          w-[66vw] max-w-[1200px]
          bg-white shadow-2xl
          flex overflow-hidden
          transform transition-all duration-500 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* LEFT PANEL */}
        <div className="flex-1 border-r border-slate-200 flex flex-col min-w-0">

          {/* Header */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-[14px] text-slate-800">
                Thanh toán #{orderNumber} — {selTable?.tableName ?? "Bàn"} / {floorLabel ?? ""}
              </span>
              <span className="text-slate-500 text-[13px] flex items-center gap-1">
                {dateStr} {timeStr}
                <Calendar size={13} className="ml-1 text-slate-400" />
                <Clock size={13} className="text-slate-400" />
              </span>
            </div>
          </div>

          {/* Customer row */}
          <div className="px-5 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              <User size={15} />
              <span>Khách lẻ</span>
            </div>
          </div>

          {/* Table header */}
          <div className="px-5 py-2 grid grid-cols-[1fr_60px_110px_110px] text-[12px] font-semibold text-slate-500 uppercase border-b border-slate-100">
            <span>Món</span>
            <span className="text-center">SL</span>
            <span className="text-right">Đơn giá</span>
            <span className="text-right">Thành tiền</span>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5">
            {mergedItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
                Chưa có món nào
              </div>
            ) : (
              mergedItems.map((item, i) => (
                <div
                  key={item._id || i}
                  className="py-3 grid grid-cols-[1fr_60px_110px_110px] text-[13px] text-slate-700 border-b border-slate-50"
                >
                  <span>{i + 1}. {item.itemName}</span>
                  <span className="text-center">{item.quantity}</span>
                  <span className="text-right text-slate-600">{fmt(item.unitPrice)}</span>
                  <span className="text-right font-semibold">
                    {fmt(item.quantity * item.unitPrice)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer total */}
          <div className="border-t border-slate-200 px-5 py-3 flex justify-between items-center text-[13px] font-semibold text-slate-800">
            <div className="flex items-center gap-2">
              <span>Tổng tiền hàng</span>
              <span className="bg-slate-100 text-slate-600 rounded-full text-[11px] px-2 py-0.5 font-normal">
                {mergedItems.length}
              </span>
            </div>
            <span>{fmt(total)}</span>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-[360px] flex flex-col bg-white">

          <div className="px-5 py-3 border-b border-slate-200">
            <span className="font-semibold text-[14px] text-slate-800">
              Chi tiết giao dịch
            </span>
          </div>

          <div className="flex-1 px-5 py-4 space-y-3 text-[13px] overflow-y-auto">

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Tổng tiền hàng
                <span className="bg-slate-100 text-slate-500 rounded-full text-[11px] px-1.5 py-0.5">
                  {mergedItems.length}
                </span>
              </span>
              <span className="font-medium text-slate-800">{fmt(total)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Giảm giá</span>
              <span>0</span>
            </div>

            <div className="flex justify-between font-semibold text-slate-800">
              <span>Khách cần trả</span>
              <span className="text-blue-700">{fmt(total)}</span>
            </div>

            {/* Input khách thanh toán */}
            <div className="pt-1">
              <div className="text-[12px] text-slate-500 mb-1.5">
                Khách thanh toán
              </div>
              <input
                className="border-2 border-slate-200 rounded w-full px-3 py-2 text-right font-semibold text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={customerPaid === 0 ? "" : fmt(customerPaid)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setCustomerPaid(Number(raw));
                }}
              />
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { id: "cash", label: "Tiền mặt" },
                { id: "transfer", label: "Chuyển khoản" },
                { id: "card", label: "Thẻ" },
              ].map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-1.5 cursor-pointer text-[13px]"
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-blue-700"
                  />
                  <span
                    className={
                      paymentMethod === m.id
                        ? "text-slate-800 font-medium"
                        : "text-slate-500"
                    }
                  >
                    {m.label}
                  </span>
                </label>
              ))}
              <button className="ml-auto text-slate-400 hover:text-slate-600">
                <MoreVertical size={15} />
              </button>
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomerPaid(amt)}
                  className={`py-1.5 text-[12px] font-medium rounded border transition-colors ${
                    customerPaid === amt
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  {fmt(amt)}
                </button>
              ))}
            </div>

            {/* Tiền thừa */}
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Tiền thừa trả khách</span>
              <span className="font-medium text-slate-800">
                {change > 0 ? fmt(change) : 0}
              </span>
            </div>

          </div>

          {/* Button thanh toán */}
          <div className="px-4 py-3 border-t border-slate-200">
            <button
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg font-semibold text-[14px] transition-colors"
              onClick={onClose}
            >
              Thanh toán
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}