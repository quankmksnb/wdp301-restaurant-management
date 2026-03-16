import KitchenFooter from "@/components/kitchen/KitchenFooter";
import TabLeft from "@/components/kitchen/TabLeft";
import TabRight from "@/components/kitchen/TabRight";
import React from "react";

export default function KitchenClientPage() {
  const updateStatus = async (itemId, newStatus, quantity, fetchData) => {
    try {
      await kitchenService.updateItemStatus(itemId, newStatus, quantity);
      toast.success("Cập nhật trạng thái thành công");
      fetchData();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
      console.error("Update status error:", error);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-[#003d7a] text-slate-800 overflow-hidden">
      <div className="flex flex-1 overflow-hidden gap-2">
        {/* Cột trái: Chờ chế biến */}
        <TabLeft updateStatus={updateStatus} />

        {/* Cột phải: Đã xong/ Chờ cung ứng */}
        <TabRight updateStatus={updateStatus} />
      </div>

      <KitchenFooter />
    </div>
  );
}
