import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AppShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
