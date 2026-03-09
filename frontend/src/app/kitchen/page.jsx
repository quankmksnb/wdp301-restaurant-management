"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function KitchenPage() {
  return (
    <ProtectedRoute role="kitchen">
      <h1>Kitchen Page</h1>
    </ProtectedRoute>
  );
}