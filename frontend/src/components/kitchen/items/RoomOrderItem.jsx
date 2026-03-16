import { Ban, ChevronRight, ChevronsRight } from "lucide-react";

export default function RoomOrderItem({
  name,
  qty,
  note,
  onOutOfStock,
  onDoneOne,
  onDoneAll,
}) {
  return (
    <div className="flex items-center justify-between py-3 pl-6">
      <div>
        <p className="font-bold">{name}</p>
        {note && <p className="text-sm text-gray-400">{note}</p>}
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

        <button
          title="Xong 1 món"
          onClick={onDoneOne}
          className="w-10 h-10 border border-red-400 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
        >
          <ChevronRight size={16} />
        </button>

        <button
          title="Xong tất cả"
          onClick={onDoneAll}
          className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
}
