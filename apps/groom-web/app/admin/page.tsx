import type { Metadata } from "next";
import AdminDashboard from "##/components/admin/Dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Groom",
  description: "God Mode Admin Panel",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
