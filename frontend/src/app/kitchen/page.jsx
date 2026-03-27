"use client";

import ProtectedRoute from "@/services/protectedRoute";
import KitchenClientPage from "@/components/kitchen/KitchenClientPage";

export default function KitchenPage() {
  return (
    <ProtectedRoute role="kitchenStaff">
      <KitchenClientPage />
    </ProtectedRoute>
  );
}
