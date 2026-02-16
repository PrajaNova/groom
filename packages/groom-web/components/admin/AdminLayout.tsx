"use client";
import type { ReactNode } from "react";
import Sidebar from "##/components/admin/Sidebar";
import "./admin.scss";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <div className="admin-root">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-container">{children}</div>
      </main>
    </div>
  );
}
