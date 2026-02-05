"use client";
import type React from "react";
import Sidebar from "./Sidebar";
import "../admin.scss"; // Ensure this import exists or create admin.scss

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
