"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

export default function NoteModal({
  open,
  onClose,
  note,
  setNote,
}) {

  const [value, setValue] = useState(note);

  useEffect(() => {
    setValue(note);
  }, [note, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">

      <div className="bg-white rounded-xl shadow-xl w-[420px] p-5">

        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-[15px]">
            Ghi chú đơn hàng
          </span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* input */}
        <div className="flex items-center gap-2 border-b border-blue-500 py-2">

          <Pencil size={14} className="text-slate-400" />

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            placeholder="Nhập ghi chú..."
            className="
            flex-1
            outline-none
            text-[15px]
            "
          />

        </div>

        {/* buttons */}
        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={onClose}
            className="
            px-4 py-2
            bg-gray-400
            text-white
            rounded-lg
            text-[13px]
            hover:bg-gray-500
            "
          >
            Bỏ qua
          </button>

          <button
            onClick={() => {
              setNote(value);
              onClose();
            }}
            className="
            px-4 py-2
            bg-blue-600
            text-white
            rounded-lg
            text-[13px]
            hover:bg-blue-700
            flex items-center gap-1
            "
          >
             Xong
          </button>
        </div>
      </div>
    </div>
  );
}