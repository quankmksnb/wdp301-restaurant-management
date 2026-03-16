"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import KitchenClientPage from "@/pages/KitchenClientPage";

export default function KitchenPage() {
  return (
    <ProtectedRoute role="kitchenStaff">
      <KitchenClientPage />
    </ProtectedRoute>
  );
}
