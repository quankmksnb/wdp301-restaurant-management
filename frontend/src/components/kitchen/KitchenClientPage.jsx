import KitchenFooter from "@/components/kitchen/KitchenFooter";
import TabLeft from "@/components/kitchen/TabLeft";
import TabRight from "@/components/kitchen/TabRight";
import { useSocket } from "@/context/SocketContext";
import { emitKitchenUpdate } from "@/utils/kitchenEvents";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function KitchenClientPage() {
  const { socket, isConnected } = useSocket();
  // Sử dụng useRef để giữ instance audio không bị tạo lại nhiều lần
  const audioRef = useRef(null);

  useEffect(() => {
    // 1. Khởi tạo audio
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/ting.mp3");
    }

    if (!socket || !isConnected) return;

    // 2. Tham gia phòng
    socket.emit("join_room", "kitchen");

    // 3. Định nghĩa hàm callback có tên cụ thể
    const handleUpdateKitchen = (data) => {
      emitKitchenUpdate();

      toast.dismiss();

      toast.success(data.message || "Có cập nhật từ phục vụ!", {
        icon: "🔔",
        duration: 3000,
        id: "kitchen-update-toast",
      });

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    socket.on("update_kitchen", handleUpdateKitchen);

    return () => {
      socket.off("update_kitchen", handleUpdateKitchen);
    };
  }, [socket, isConnected]);

  return (
    <div className="flex flex-col h-screen bg-[#003d7a] text-slate-800 overflow-hidden">
      <div className="flex flex-1 overflow-hidden gap-2">
        <TabLeft />
        <TabRight />
      </div>
      <KitchenFooter />
    </div>
  );
}
