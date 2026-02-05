"use client";
import React, { useState } from "react";
import Sidebar, { type AdminSection } from "./Sidebar";
import BlogsSection from "./sections/BlogsSection";
import BookingsSection from "./sections/BookingsSection";
import ConfessionsSection from "./sections/ConfessionsSection";
import RolesSection from "./sections/RolesSection";

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("bookings");

  return (
    <div className="flex h-screen bg-[#FDFCFB]">
      <Sidebar currentSection={section} onSectionChange={setSection} />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-8 max-w-7xl mx-auto">
          {section === "bookings" && <BookingsSection />}
          {section === "confessions" && <ConfessionsSection />}
          {section === "blogs" && <BlogsSection />}
          {section === "roles" && <RolesSection />}
        </div>
      </main>
    </div>
  );
}
