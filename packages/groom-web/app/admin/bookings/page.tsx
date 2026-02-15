import BookingsAdminTable from "@/components/admin/BookingsAdminTable";
import { fetchServer } from "@/services/serverApi";

// Revalidate every 60 seconds to keep the list fresh
export const revalidate = 60;

export default async function AdminBookingsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch all bookings (Admin can see all via fetchServer which passes auth cookie)
  // Optional: Add status/date filters if API supports them via query params
  // e.g. /api/bookings?fromDate=... 
  const bookings = await fetchServer<any[]>("/api/bookings");

  const bookingRows = bookings.map((bk: any) => ({
    id: String(bk.id ?? ""),
    name: String(bk.name ?? ""),
    email: String(bk.email ?? ""),
    when: bk.when ? String(bk.when) : undefined,
    link: String(bk.meetingId ?? ""),
    message: String(bk.reason ?? ""),
    meetingId: bk.meetingId ? String(bk.meetingId) : undefined,
    status: String(bk.status ?? "pending"),
  }));

  return <BookingsAdminTable bookings={bookingRows} />;
}
