"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ReceptionPage() {
  return (
    <ProtectedRoute role="receptionist">
      <h1>Reception Page</h1>
    </ProtectedRoute>
  );
}