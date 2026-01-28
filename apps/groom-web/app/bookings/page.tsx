"use client";

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

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/booking?status=pending,confirmed");
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
