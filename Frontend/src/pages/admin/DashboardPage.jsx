import { useEffect } from "react";
import AdminLayout   from "../../layouts/AdminLayout";
import AdminHeader   from "../../features/admin/components/AdminHeader";
import DashboardStats from "../../features/admin/components/DashboardStats";

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Dashboard — AniCalendar";
  }, []);
  return (
    <AdminLayout>
      <AdminHeader title="Dashboard" />
      <div style={{ padding: "32px" }}>
        <DashboardStats />
      </div>
    </AdminLayout>
  );
}