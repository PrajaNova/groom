"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import Modal from "##/components/Modal";
import BookingList from "./BookingList";

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  status: "confirmed" | "pending" | "cancelled";
  email?: string;
  meetingId?: string | null;
  isoDate: string;
}

interface BackendBooking {
  id: string;
  name: string;
  email: string;
  when: string;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled";
  meetingId?: string | null;
  createdAt: string;
}

function BookingPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const newBooking = searchParams.get("newBooking") === "true";

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/booking");
      const data: BackendBooking[] = await res.json();

      const formatted: Booking[] = data.map((b) => {
        const dateObj = new Date(b.when);
        return {
          id: b.id,
          date: dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: dateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          service: b.reason || "General Session",
          status: b.status,
          email: b.email,
          meetingId: b.meetingId,
          isoDate: b.when,
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2EF] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#006442]"></div>
        <p className="mt-4 text-[#2C3531] font-medium text-lg">
          Loading your sessions...
        </p>
      </div>
    );
  }

  if (newBooking && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F2EF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-[#006442]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2C3531] mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your session has been successfully booked. We’ve sent a confirmation
            to your email with all the details.
          </p>
          <button
            type="button"
            onClick={() => window.location.replace("/bookings")}
            className="w-full bg-[#006442] hover:bg-[#004d32] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2EF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#2C3531] mb-2">
            My Bookings
          </h1>
          <p className="text-[#006442] font-medium">
            Transform Today, Lead Tomorrow
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 min-h-[400px]">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Upcoming Sessions
              </h2>
            </div>
            <BookingList bookings={bookings} onRefresh={fetchBookings} />
          </div>
        </div>
      </div>
      <Modal />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0F2EF] flex items-center justify-center text-[#006442]">
          Loading...
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
