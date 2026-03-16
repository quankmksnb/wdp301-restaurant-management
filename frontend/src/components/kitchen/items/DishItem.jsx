import { Ban, ChevronRight, ChevronsRight } from "lucide-react";

export default function DishItem({
  name,
  qty,
  onOutOfStock,
  onDoneOne,
  onDoneAll,
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex-1">
        <h3 className="font-bold text-lg">{name}</h3>
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

          <button
            title="Xong 1 món"
            onClick={onDoneOne}
            className="w-10 h-10 cursor-pointer border border-red-400 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all"
          >
            <ChevronRight size={16} />
          </button>

          <button
            title="Xong tất cả"
            onClick={onDoneAll}
            className="w-10 h-10 cursor-pointer bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 shadow-sm transition-all"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
