"use client";

import { Calendar, CalendarDays, Clock, Video, XCircle } from "lucide-react";
import Link from "next/link";
import ModalManager from "##/utils/ModalManager";
import { showAlert, showConfirm } from "##/utils/modalHelpers";
import RescheduleBookingModal from "./RescheduleBookingModal";

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

interface Props {
  bookings: Booking[];
  onRefresh: () => void;
}

const BookingList: React.FC<Props> = ({ bookings, onRefresh }) => {
  const handleReschedule = (booking: Booking) => {
    ModalManager.open(
      <RescheduleBookingModal booking={booking} onSuccess={onRefresh} />,
    );
  };

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to cancel booking");

      onRefresh();
    } catch (err) {
      console.error(err);
      showAlert(String(err));
    }
  };

  const handleCancel = (booking: Booking) => {
    showConfirm(
      "Are you sure you want to cancel this session? This action cannot be undone.",
      () => {
        cancelBooking(booking.id);
      },
    );
  };

  const handleJoin = (meetingId?: string | null) => {
    if (meetingId) {
      window.open(`https://meet.google.com/${meetingId}`, "_blank");
    } else {
      showAlert("Meeting link is not available yet.");
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No sessions scheduled
        </h3>
        <p className="text-gray-500 max-w-sm mb-8">
          You haven't booked any sessions yet. Take the first step towards your
          transformation today.
        </p>
        <Link
          href="/#booking"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#006442] hover:bg-[#004d32] shadow-sm transition-all duration-200"
        >
          Book a Session
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#006442] opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                  ID: {booking.id.slice(-6)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {booking.service}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#006442]" />
                  {booking.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#006442]" />
                  {booking.time}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              {/* Resume/Join Button */}
              {booking.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => handleJoin(booking.meetingId)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#006442] hover:bg-[#004d32] transition-colors shadow-sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join
                </button>
              )}

              {/* Reschedule Button */}
              {booking.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => handleReschedule(booking)}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Reschedule
                </button>
              )}

              {/* Cancel Button */}
              {booking.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => handleCancel(booking)}
                  className="inline-flex items-center px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
