import BookingsAdminTable from "##/components/admin/BookingsAdminTable";

// Revalidate every 60 seconds to keep the list fresh
export const revalidate = 60;

export default async function AdminBookingsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const res = await fetch(
    "/api/bookings?status=confirmed,pending&fromDate=" + today.toISOString(),
    { cache: "no-store" },
  );
  const bookings = res.ok ? await res.json() : [];

  const bookingRows = bookings.map((bk: any) => {
    return {
      id: String(bk.id ?? ""),
      name: String(bk.name ?? ""),
      email: String(bk.email ?? ""),
      when: bk.when ? String(bk.when) : undefined,
      link: String(bk.meetingId ?? ""),
      message: String(bk.reason ?? ""),
      meetingId: bk.meetingId ? String(bk.meetingId) : undefined,
      status: String(bk.status ?? "pending"),
    };
  });

  return <BookingsAdminTable bookings={bookingRows} />;
}
