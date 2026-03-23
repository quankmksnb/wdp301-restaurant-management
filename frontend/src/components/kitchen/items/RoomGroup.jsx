import RoomOrderItem from "./RoomOrderItem";
import { ChevronsRight } from "lucide-react";

export default function RoomGroup({ table }) {
  return (
    <div className="border-b border-gray-200 py-4">
      {/* Header bàn */}
      <div className="flex items-center justify-between px-4">
        <div>
          <h3 className="font-bold text-blue-700">{table.tableName}</h3>
          <p className="text-xs text-gray-400">{table.items.length} món</p>
        </div>

        <button className="bg-pink-500 w-14 h-8 rounded-full flex items-center justify-center text-white">
          <ChevronsRight size={18} />
        </button>
      </div>

      {/* List món */}
      <div className="mt-3">
        {table.items.map((item) => (
          <RoomOrderItem
            key={item.orderItemId}
            name={item.itemName}
            qty={item.quantity}
            note={item.note}
            status={item.status}
          />
        ))}
      </div>
    </div>
  );
}
