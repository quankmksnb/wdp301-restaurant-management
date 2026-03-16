import { Ban, ChevronRight, ChevronsRight } from "lucide-react";

export default function RoomOrderItem({ name, qty, note }) {
  return (
    <div className="flex items-center justify-between py-3 pl-6">
      <div>
        <p className="font-bold">{name}</p>
        {note && <p className="text-sm text-gray-400">{note}</p>}
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">{qty}</span>

        {/* Nút Báo hết hàng */}
        <button
          title="Báo hết hàng"
          className="w-10 h-10 cursor-pointer border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-all"
        >
          <Ban size={16} />
        </button>

        {/* Nút Chuyển 1 món */}
        <button
          title="Xong 1 món"
          className="w-10 h-10 cursor-pointer border border-red-400 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
        >
          <ChevronRight size={16} />
        </button>

        {/* Nút Chuyển tất cả */}
        <button
          title="Xong tất cả"
          className="w-10 h-10 cursor-pointer bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 shadow-sm transition-all"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
}
