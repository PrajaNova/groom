"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookingButton from "@/components/BookingButton";
import { useAuth } from "@/context/AuthContext";
import bookingService, { type Booking } from "@/services/bookingService";
import ModalManager from "@/utils/ModalManager";
import LoginModal from "@/components/auth/LoginModal";

const MyBookingsPage = () => {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await bookingService.getAll();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBookings();
  }, [user]);

  const openLogin = () => {
    ModalManager.open(<LoginModal isOpen={true} onClose={() => ModalManager.close()} />);
  };

  const handleReschedule = async (booking: Booking) => {
    const newDate = prompt(
      "Enter new date (YYYY-MM-DD HH:MM):",
      new Date(booking.when).toISOString().slice(0, 16),
    );
    if (newDate) {
      try {
        await bookingService.update(booking.id, {
          when: new Date(newDate).toISOString(),
        });
        window.location.reload(); // Simple reload to refresh
      } catch (e) {
        console.error(e);
        alert("Error updating booking");
      }
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingService.delete(bookingId);
        window.location.reload();
      } catch (e) {
        console.error(e);
        alert("Failed to cancel booking");
      }
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006442]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#2C3531]">My Bookings</h1>
        <p className="text-gray-600 mb-8">
          Please login to view your bookings.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={openLogin}
            className="px-6 py-2 bg-[#006442] text-white rounded-md hover:bg-[#004d32] transition-colors"
          >
            Log In
          </button>
          <Link href="/" className="px-6 py-2 border border-[#006442] text-[#006442] rounded-md hover:bg-green-50 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-[#2C3531]">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>No bookings yet</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            You haven't made any bookings. Start your journey with us today.
          </p>
          <BookingButton className="bg-[#006442] text-white hover:bg-[#004d32]" />
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(booking.when).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(booking.when).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {booking.reason}
                </h3>
                {booking.meetingId && (
                  <p className="text-sm text-gray-600">
                    Meeting ID:{" "}
                    <span className="font-mono">{booking.meetingId}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                {booking.status !== "cancelled" &&
                  booking.status !== "completed" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReschedule(booking)}
                        className="px-4 py-2 text-sm font-medium text-[#006442] bg-white border border-[#006442] rounded-md hover:bg-green-50 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyBookingsPage;
