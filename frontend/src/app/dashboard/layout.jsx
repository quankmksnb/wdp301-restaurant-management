import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProtectedRoute from "@/services/protectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute role="manager">
      <DashboardHeader />
      <main className="max-w-387.5 w-full mx-auto h-[calc(100vh-96px)]">
        {children}
      </main>
    </ProtectedRoute>
  );
}
