"use client";

import { useState } from "react";
import ModalManager from "##/utils/ModalManager";
import { showAlert } from "##/utils/modalHelpers";

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  isoDate: string;
}

interface Props {
  booking?: Booking | null;
  mode?: "reschedule" | "suggest";
  onSuggest?: (datetime: string) => void;
  onSuccess?: () => void;
}

const RescheduleBookingModal: React.FC<Props> = ({
  booking = null,
  mode = "reschedule",
  onSuggest,
  onSuccess,
}) => {
  // Convert ISO string (2024-12-15T14:00:00.000Z) to local datetime-local format (2024-12-15T14:00)
  const formatForInput = (isoString: string) => {
    try {
      if (!isoString) return "";
      // Create date object and adjust for timezone offset to show correct local time in input
      const date = new Date(isoString);
      const offset = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
      return localISOTime;
    } catch (e) {
      console.error("Invalid date format", e);
      return "";
    }
  };

  const [dateTime, setDateTime] = useState(
    booking?.isoDate ? formatForInput(booking.isoDate) : "",
  );
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (!dateTime) {
      showAlert("Please select a new date and time.");
      return;
    }

    // Suggest mode: invoke callback and close modal (caller handles API)
    if (mode === "suggest") {
      ModalManager.close();
      setTimeout(() => {
        onSuggest?.(dateTime);
      }, 200);
      return;
    }
    setLoading(true);
    try {
      const when = new Date(dateTime).toISOString();

      // booking should exist in reschedule mode
      const res = await fetch(`/api/bookings/${booking?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ when }),
      });

      if (!res.ok) throw new Error("Failed to reschedule booking");

      onSuccess?.();
      ModalManager.close();
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong while rescheduling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-[#2C3531] mb-1">
        {mode === "suggest" ? "Suggest New Time" : "Reschedule Session"}
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        {mode === "suggest"
          ? "Propose a new time for this session. This will send the suggested time to be reviewed."
          : "Choose a new time for your session."}
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        {booking && (
          <>
            <h3 className="text-lg font-semibold text-[#006442] mb-1">
              {booking.service}
            </h3>
            <p className="text-gray-600 text-sm">
              Currently scheduled for: {booking.date} at {booking.time}
            </p>
          </>
        )}

        <div className="mt-6">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              New Date & Time
            </span>
            <div className="relative">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006442] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => ModalManager.close()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleConfirm}
          className="flex items-center px-4 py-2 bg-[#2C3531] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Loading</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {mode === "suggest"
            ? "Send Suggestion"
            : loading
              ? "Updating..."
              : "Confirm Change"}
        </button>
      </div>
    </div>
  );
};

export default RescheduleBookingModal;
