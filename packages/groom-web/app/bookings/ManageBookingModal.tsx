"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import ModalManager from "##/utils/ModalManager";
import { showAlert, showConfirm } from "##/utils/modalHelpers";
import RescheduleBookingModal from "./RescheduleBookingModal";

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  isoDate: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface Props {
  booking: Booking;
}

const ManageBookingModal: React.FC<Props> = ({ booking }) => {
  const router = useRouter();

  const handleCancel = () => {
    showConfirm("Are you sure you want to cancel this booking?", async () => {
      try {
        const res = await fetch(`/api/bookings/${booking.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to cancel booking");

        showAlert("Booking cancelled successfully!", () => router.refresh());
      } catch (err) {
        console.error(err);
        showAlert(String(err));
      }
    });
  };

  const handleReschedule = () => {
    ModalManager.open(<RescheduleBookingModal booking={booking} />);
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-[#2C3531] mb-4">Manage Booking</h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-[#B48B7F] mb-2">
          {booking.service}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Reschedule booking icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {booking.date}
        </div>
        <div className="flex items-center text-gray-600">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {" "}
            <title>Reschedule booking icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {booking.time}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleReschedule}
          className="flex items-center px-4 py-2 bg-[#2C3531] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Reschedule booking icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Reschedule
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Cancel booking icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default ManageBookingModal;
