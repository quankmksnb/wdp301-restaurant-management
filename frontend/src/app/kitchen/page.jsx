"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function KitchenPage() {
  return (
    <ProtectedRoute role="kitchenStaff">
      <h1>Kitchen Page</h1>
    </ProtectedRoute>
  );
}
