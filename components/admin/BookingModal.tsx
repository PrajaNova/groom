"use client";

import { useRouter } from "next/navigation";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type Booking = {
  id?: string;
  name?: string;
  email?: string;
  time?: string | Date;
  when?: string | Date;
  link?: string;
  message?: string;
};

type Props = {
  booking: Booking | null;
  onClose: () => void;
};

export default function BookingModal({ booking, onClose }: Props) {
  const router = useRouter();

  if (!booking) return null;

  async function handleMarkDone() {
    showConfirm("Mark this booking as done?", async () => {
      const id = booking?.id;
      if (!id) {
        showAlert("Missing booking id");
        return;
      }

      try {
        const res = await fetch(`/api/booking/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        if (!res.ok) throw new Error("Failed to mark booking done");
        showAlert("Booking marked as done", () => {
          onClose();
          router.refresh();
        });
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 transform transition-all duration-300 max-h-[90vh] overflow-auto relative">
        {/* Header with close button */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-3xl font-bold text-[#B48B7F]">Booking Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#2C3531] hover:text-red-500 transition p-1"
            aria-label="Close"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="false"
            >
              <title>Close</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div>
            <p className="block text-sm font-medium text-gray-700">Name</p>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-700">
              {booking.name ?? "-"}
            </div>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-700">Email</p>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-700">
              {booking.email ?? "-"}
            </div>
          </div>

          <div>
            <label
              htmlFor="time-request"
              className="block text-sm font-medium text-gray-700"
            >
              Time Request
            </label>
            <input
              id="time-request"
              type="text"
              readOnly
              value={
                booking.time || booking.when
                  ? new Date(
                      (booking.time ?? booking.when) as string | Date,
                    ).toLocaleString()
                  : "-"
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
          </div>

          {booking.message ? (
            <div>
              <p className="block text-sm font-medium text-gray-700">Message</p>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap">
                {booking.message}
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer mt-6 flex justify-center gap-3">
          {/* Done - keep as-is */}
          <button
            type="button"
            className="px-3 py-2 text-sm rounded-md bg-transparent border border-gray-200 text-[#2C3531] hover:bg-gray-50"
            onClick={handleMarkDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
