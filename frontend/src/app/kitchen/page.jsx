"use client";

import ProtectedRoute from "@/services/protectedRoute";
import KitchenClientPage from "@/components/kitchen/KitchenClientPage";
import { useSocket } from "@/context/SocketContext";
import { useEffect } from "react";

export default function KitchenPage() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join_room", "kitchen");
    }
  }, [socket, isConnected]);
  return (
    <ProtectedRoute role="kitchenStaff">
      <KitchenClientPage />
    </ProtectedRoute>
  );
}
