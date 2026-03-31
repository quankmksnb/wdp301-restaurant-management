"use client";

import { useState, useEffect } from "react";

export default function GuestModal({
  open,
  onClose,
  guestCount,
  setGuestCount,
}) {
  const [value, setValue] = useState(guestCount);

  useEffect(() => {
    setValue(guestCount);
  }, [guestCount, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">

      <div className="bg-white rounded-xl shadow-xl w-[380px] p-5">

        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-[15px]">
            Số lượng khách
          </span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* input */}
        <input
  type="number"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  autoFocus
  className="
  w-full
  border-b
  border-blue-500
  outline-none
  text-[16px]
  py-2
  "
/>

        {/* buttons */}
        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={onClose}
            className="
            px-4 py-2
            bg-gray-300
            text-white
            rounded-lg
            text-[13px]
            hover:bg-gray-400
            "
          >
            Bỏ qua
          </button>

          <button
            onClick={() => {
  setGuestCount(Number(value) || 1);
  onClose();
}}
            className="
            px-4 py-2
            bg-blue-600
            text-white
            rounded-lg
            text-[13px]
            hover:bg-blue-700
            "
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}