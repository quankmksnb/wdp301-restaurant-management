import DashboardHeader from "@/app/dashboard/components/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      <main className="max-w-387.5 w-full mx-auto h-[calc(100vh-96px)]">{children}</main>
    </>
  );
}
