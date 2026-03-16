import KitchenFooter from "@/components/kitchen/KitchenFooter";
import TabLeft from "@/components/kitchen/TabLeft";
import TabRight from "@/components/kitchen/TabRight";
import React from "react";

export default function KitchenClientPage() {
  return (
    <div className="flex flex-col h-screen bg-[#003d7a] text-slate-800 overflow-hidden">
      <div className="flex flex-1 overflow-hidden gap-2">
        {/* Cột trái: Chờ chế biến */}
        <TabLeft />

        {/* Cột phải: Đã xong/ Chờ cung ứng */}
        <TabRight />
      </div>

      <KitchenFooter />
    </div>
  );
}
