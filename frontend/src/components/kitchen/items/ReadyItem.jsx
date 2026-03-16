import { ChevronRight, ChevronsRight } from "lucide-react";

export default function ReadyItem({
  name,
  table,
  qty,
  note,
  onServeOne,
  onServeAll,
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
      <div>
        <h3 className="font-bold text-lg">{name}</h3>
        {note && <p className="text-sm text-gray-400">{note}</p>}
      </div>

      <div className="flex items-center gap-6">
        <span className="font-bold text-xl">{qty}</span>

        <p className="font-semibold text-blue-700 w-20">{table}</p>

        {/* serve 1 */}
        <button
          onClick={onServeOne}
          className="w-10 h-10 border border-[#28B44F] rounded-full flex items-center justify-center text-[#28B44F] hover:bg-[#28B44F]/10"
        >
          <ChevronRight size={16} />
        </button>

        {/* serve all */}
        <button
          onClick={onServeAll}
          className="w-10 h-10 bg-[#28B44F] rounded-full flex items-center justify-center text-white hover:opacity-75"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
}
