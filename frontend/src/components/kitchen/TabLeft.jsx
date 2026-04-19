"use client";

import { useEffect, useState } from "react";
import SearchBox from "@/components/kitchen/SearchBox";
import PriorityTab from "@/components/kitchen/tabs/PriorityTab";
import ByDishTab from "@/components/kitchen/tabs/ByDishTab";
import ByRoomTab from "@/components/kitchen/tabs/ByRoomTab";
import toast from "react-hot-toast";
import kitchenService from "@/services/kitchenService";
import { emitKitchenUpdate } from "@/utils/kitchenEvents";
import { useSocket } from "@/context/SocketContext";

export default function TabLeft() {
  const { socket, isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState("priority");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "priority", label: "Ưu tiên" },
    { id: "by-dish", label: "Theo món" },
    { id: "by-room", label: "Theo phòng/bàn" },
  ];

  const updateStatus = async (
    itemId,
    newStatus,
    quantity,
    fetchData,
    message = "Cập nhật trạng thái thành công",
  ) => {
    try {
      await kitchenService.updateItemStatus(itemId, newStatus, quantity);
      toast.success(message);
      fetchData();
      emitKitchenUpdate();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
      console.error("Update status error:", error);
    }
  };

  return (
    <div className="flex-1 bg-[#003d7a] rounded-tr-md rounded-br-md flex flex-col overflow-hidden ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11.25">
        <h2 className="text-white font-bold">Chờ chế biến</h2>

        <div className="flex items-center pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 transition-all duration-200 font-medium rounded-t-lg text-[14px] ${
                activeTab === tab.id
                  ? "bg-white text-blue-800"
                  : "text-white opacity-60 hover:opacity-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {activeTab === "priority" && (
          <PriorityTab searchTerm={searchTerm} updateStatus={updateStatus} />
        )}
        {activeTab === "by-dish" && (
          <ByDishTab searchTerm={searchTerm} updateStatus={updateStatus} />
        )}
        {activeTab === "by-room" && (
          <ByRoomTab searchTerm={searchTerm} updateStatus={updateStatus} />
        )}
      </div>
    </div>
  );
}
