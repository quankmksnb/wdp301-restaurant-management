import TagStatus from "@/components/kitchen/TagStatus";
import {
  Ban,
  Check,
  CheckCheck,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function DishItem({
  name,
  qty,
  onOutOfStock,
  onActionOne,
  onActionAll,
  status,
}) {
  const isOrderSent = status === "order_sent";
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex-1 flex items-center gap-3">
        <h3 className="font-bold text-lg">{name}</h3>
        <TagStatus status={status} />
      </div>

      <div className="flex items-center gap-8">
        <span className="font-bold text-xl">{qty}</span>

        <div className="flex gap-2">
          <button
            title="Báo hết hàng"
            onClick={onOutOfStock}
            className="w-10 h-10 cursor-pointer border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-all"
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
    </div>
  );
}
