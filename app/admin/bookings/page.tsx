import BookingsAdminTable from "##/components/admin/BookingsAdminTable";
import BookingDB from "##/DataBase/BookingDB";

// Revalidate every 60 seconds to keep the list fresh
export const revalidate = 60;

export default async function AdminBookingsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await BookingDB.getBookings({
    status: ["confirmed", "pending"],
    fromDate: today,
  });

  const bookingRows = bookings.map((bk: unknown) => {
    const row = bk as Record<string, unknown>;
    return {
      id: String(row.id ?? ""),
      name: String(row.name ?? ""),
      email: String(row.email ?? ""),
      when: row.when ? String(row.when) : undefined,
      link: String(row.meetingId ?? ""),
      message: String(row.reason ?? ""),
      meetingId: row.meetingId ? String(row.meetingId) : undefined,
      status: String(row.status ?? "pending"),
    };
  });

  return <BookingsAdminTable bookings={bookingRows} />;
}
