"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function WaiterPage() {
  return (
    <ProtectedRoute role="waiter">
      <h1>Waiter Page</h1>
    </ProtectedRoute>
  );
}