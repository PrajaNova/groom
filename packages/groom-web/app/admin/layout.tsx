import Sidebar from "@/components/admin/Sidebar";
import "@/components/admin/admin.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Groom",
  description: "Admin panel for managing blogs, confessions, and bookings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-container">{children}</div>
      </main>
    </div>
  );
}
