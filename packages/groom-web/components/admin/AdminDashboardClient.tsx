"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BlogsAdminTable from "##/components/admin/BlogsAdminTable";
import BookingsAdminTable from "##/components/admin/BookingsAdminTable";
import ConfessionsAdminTable from "##/components/admin/ConfessionsAdminTable";
import BookingModal from "./BookingModal";

type BlogRow = { id: string; title?: string; slug?: string };
type ConfessionRow = { id: string; slug?: string; content?: string };
type BookingRow = {
  id: string;
  name?: string;
  email?: string;
  when?: string | Date;
  link?: string;
  message?: string;
};

type Props = {
  blogs: BlogRow[];
  confessions: ConfessionRow[];
  bookings: BookingRow[];
};

export default function AdminDashboardClient({
  blogs,
  confessions,
  bookings,
}: Props) {
  const pathname = usePathname() || "";
  const [section, setSection] = useState<"blogs" | "confessions" | "bookings">(
    pathname.includes("/admin/bookings")
      ? "bookings"
      : pathname.includes("/admin/confessions")
        ? "confessions"
        : "blogs",
  );
  const [openBooking, setOpenBooking] = useState<string | null>(null);

  useEffect(() => {
    if (pathname.includes("/admin/bookings")) setSection("bookings");
    else if (pathname.includes("/admin/confessions")) setSection("confessions");
    else setSection("blogs");
  }, [pathname]);

  const booking = bookings.find((b) => b.id === openBooking) ?? null;

  return (
    <>
      <div className="admin-content">
        {section === "blogs" && <BlogsAdminTable blogs={blogs} />}
        {section === "confessions" && (
          <ConfessionsAdminTable confessions={confessions} />
        )}
        {section === "bookings" && <BookingsAdminTable bookings={bookings} />}
      </div>
      <BookingModal booking={booking} onClose={() => setOpenBooking(null)} />
    </>
  );
}
