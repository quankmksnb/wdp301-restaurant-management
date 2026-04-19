"use client";

import { useEffect, useState } from "react";
import { CheckCheck, ChevronsRight, Play } from "lucide-react";
import { emitKitchenUpdate, kitchenEvents } from "@/utils/kitchenEvents";
import RoomOrderItem from "@/components/kitchen/items/RoomOrderItem";
import toast from "react-hot-toast";
import kitchenService from "@/services/kitchenService";

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
  const handleTableBulkAction = async (items) => {
    // 1. Lấy danh sách ID theo từng trạng thái
    const preparingIds = items
      .filter((i) => i.status === "preparing")
      .map((i) => i.orderItemId);

    const orderSentIds = items
      .filter((i) => i.status === "order_sent")
      .map((i) => i.orderItemId);

    try {
      if (preparingIds.length > 0) {
        // Ưu tiên: Nếu có món đang làm, bấm "Tất cả" sẽ chuyển hết sang "Xong"
        await kitchenService.updateBulkStatus(preparingIds, "ready");
        toast.success(`Đã hoàn thành ${preparingIds.length} món đang chế biến`);
      } else if (orderSentIds.length > 0) {
        // Nếu không có món đang làm, thì chuyển toàn bộ món mới sang "Đang làm"
        await kitchenService.updateBulkStatus(orderSentIds, "preparing");
        toast.success(`Đã bắt đầu chế biến ${orderSentIds.length} món mới`);
      }

      // Refresh dữ liệu và báo hiệu cho các tab khác
      fetchData();
      emitKitchenUpdate();
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.error("Không thể cập nhật trạng thái hàng loạt");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    kitchenEvents.addEventListener("kitchen-updated", fetchData);

    return () => {
      kitchenEvents.removeEventListener("kitchen-updated", fetchData);
    };
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="flex flex-col px-2">
      {tables.map((table) => {
        const hasPreparing = table.items.some((i) => i.status === "preparing");
        const hasOrderSent = table.items.some((i) => i.status === "order_sent");
        return (
          <div key={table._id} className="border-b">
            {/* HEADER TABLE */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <div className="font-bold text-blue-700">
                {table.tableName} ({table.itemCount})
              </div>

              {/* Nút Tất cả mới */}
              {(hasPreparing || hasOrderSent) && (
                <button
                  onClick={() => handleTableBulkAction(table.items)}
                  className={`flex items-center gap-2 text-white px-4 py-1.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                    hasPreparing
                      ? "bg-green-600 hover:bg-green-700" // Nếu có món đang làm -> Hiện nút Xong (Xanh lá)
                      : "bg-blue-600 hover:bg-blue-700" // Nếu chỉ có món mới -> Hiện nút Nhận làm (Xanh dương)
                  }`}
                >
                  {hasPreparing ? (
                    <>
                      <CheckCheck size={16} strokeWidth={3} />
                      Xong tất cả
                    </>
                  ) : (
                    <>
                      <ChevronsRight size={14} fill="white" />
                      Làm tất cả
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ITEMS */}
            {table.items.map((item) => {
              const nextStatus =
                item.status === "order_sent" ? "preparing" : "ready";
              return (
                <RoomOrderItem
                  key={item.orderItemId}
                  name={item.itemName}
                  qty={item.quantity}
                  note={item.note}
                  onActionOne={() =>
                    updateStatus(item.orderItemId, nextStatus, 1, fetchData)
                  }
                  onActionAll={() =>
                    updateStatus(item.orderItemId, nextStatus, "all", fetchData)
                  }
                  onOutOfStock={() =>
                    updateStatus(
                      item.orderItemId,
                      "out_of_stock",
                      "all",
                      fetchData,
                    )
                  }
                  status={item.status}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
