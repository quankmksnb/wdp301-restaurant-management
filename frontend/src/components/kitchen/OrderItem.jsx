import { ChevronRight, ChevronsRight } from "lucide-react";

export const OrderItem = ({ name, table, time, qty, note }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
    <div className="flex-1">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-gray-500">{note}</p>
    </div>
    <div className="flex items-center gap-8">
      <span className="font-bold text-xl">{qty}</span>
      <div className="w-24">
        <p className="font-semibold text-blue-700">{table}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
      <div className="flex gap-2">
        <button className="w-10 h-10 border border-red-400 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50">
          <ChevronRight size={16} />
        </button>
        <button className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600">
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  </div>
);
