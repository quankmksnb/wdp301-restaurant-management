import TagStatus from "@/components/kitchen/TagStatus";
import { STATUS_CONFIG } from "@/consts/kitchenStatuses";
import {
  Ban,
  Check,
  CheckCheck,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Play } from "next/font/google";

export default function RoomOrderItem({
  name,
  qty,
  note,
  onOutOfStock,
  onActionOne,
  onActionAll,
  status,
}) {
  const isOrderSent = status === "order_sent";
  return (
    <div className="flex items-center justify-between py-3 pl-6">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-slate-700">{name}</p>
          {STATUS_CONFIG[status] && <TagStatus status={status} />}
        </div>
        {!note && (
          <p className="text-sm text-gray-500">
            Ghi chú: <span className="italic">Không có ghi chú</span>
          </p>
        )}
        {note && <p className="text-sm text-gray-500">Ghi chú: {note}</p>}
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">{qty}</span>

        <button
          title="Báo hết hàng"
          onClick={onOutOfStock}
          className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500"
        >
          <Ban size={16} />
        </button>
        {/* Nhóm nút hành động thay đổi theo status */}
        {isOrderSent ? (
          <>
            {/* Nút Bắt đầu làm 1 món */}
            <button
              title="Bắt đầu làm 1 món"
              onClick={onActionOne}
              className="w-10 h-10 border border-blue-400 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all"
            >
              <ChevronRight size={16} fill="currentColor" />
            </button>
            {/* Nút Bắt đầu làm tất cả */}
            <button
              title="Bắt đầu làm tất cả"
              onClick={onActionAll}
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              <ChevronsRight size={20} fill="white" />
            </button>
          </>
        ) : (
          <>
            {/* Nút Xong 1 món */}
            <button
              title="Xong 1 món"
              onClick={onActionOne}
              className="w-10 h-10 border border-green-500 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-all"
            >
              <Check size={18} strokeWidth={3} />
            </button>
            {/* Nút Xong tất cả */}
            <button
              title="Xong tất cả"
              onClick={onActionAll}
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 shadow-sm transition-all"
            >
              <CheckCheck size={22} strokeWidth={3} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
