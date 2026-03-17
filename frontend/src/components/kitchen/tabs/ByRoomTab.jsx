"use client";

import { useEffect, useState } from "react";
import kitchenService from "@/services/kitchenService";
import { ChevronsRight } from "lucide-react";
import { emitKitchenUpdate } from "@/utils/kitchenEvents";
import RoomOrderItem from "@/components/kitchen/items/RoomOrderItem";
import toast from "react-hot-toast";

export default function ByRoomTab() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await kitchenService.getOrdersByTable();

      setTables(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status, quantity = "all") => {
    try {
      await kitchenService.updateItemStatus(id, status, quantity);

      emitKitchenUpdate();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // serve toàn bộ bàn
  const serveAllTable = async (items) => {
    try {
      await Promise.all(
        items.map((item) =>
          kitchenService.updateItemStatus(item.orderItemId, "ready", "all"),
        ),
      );

      emitKitchenUpdate();
      fetchData();
      toast.success("Đã phục vụ toàn bộ bàn!");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="flex flex-col px-2">
      {tables.map((table) => (
        <div key={table._id} className="border-b">
          {/* HEADER TABLE */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div className="font-bold text-blue-700">
              {table.tableName} ({table.itemCount})
            </div>

            <button
              onClick={() => serveAllTable(table.items)}
              className="flex items-center gap-2 text-white bg-pink-500 px-3 py-1 rounded-md hover:bg-pink-600"
            >
              <ChevronsRight size={16} />
              Tất cả
            </button>
          </div>

          {/* ITEMS */}
          {table.items.map((item) => (
            <RoomOrderItem
              key={item.orderItemId}
              name={item.itemName}
              qty={item.quantity}
              note={item.note}
              onDoneOne={() => updateStatus(item.orderItemId, "ready", 1)}
              onDoneAll={() => updateStatus(item.orderItemId, "ready", "all")}
              onOutOfStock={() =>
                updateStatus(item.orderItemId, "cancelled", "all")
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
