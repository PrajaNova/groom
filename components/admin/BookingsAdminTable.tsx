"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BookingModal from "##/components/admin/BookingModal";
import ModalManager from "##/utils/ModalManager";
import { showAlert, showConfirm } from "##/utils/modalHelpers";
import RescheduleBookingModal from "../../app/bookings/RescheduleBookingModal";

type BookingRow = {
  id: string;
  name?: string;
  email?: string;
  when?: string | Date;
  link?: string;
  message?: string;
  meetingId?: string;
  status?: string;
};

type Props = { bookings: BookingRow[] };

export default function BookingsAdminTable({ bookings }: Props) {
  const router = useRouter();
  const [openBooking, setOpenBooking] = useState<string | null>(null);
  const booking = bookings.find((b) => b.id === openBooking) ?? null;

  async function handleCancel(id: string) {
    showConfirm(
      "Cancel this booking? This will delete the booking.",
      async () => {
        try {
          const res = await fetch(`/api/booking/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to cancel booking");
          showAlert("Booking cancelled", () => {
            router.refresh();
          });
        } catch (err) {
          showAlert(String(err));
        }
      },
    );
  }

  async function handleConfirm(id: string) {
    showConfirm("Confirm this booking?", async () => {
      try {
        const res = await fetch(`/api/booking/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        });
        if (!res.ok) throw new Error("Failed to confirm booking");
        showAlert("Booking confirmed", () => {
          router.refresh();
        });
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  function openSuggestModal(bk: BookingRow) {
    const iso = bk.when ? new Date(bk.when).toISOString() : "";
    const booking = {
      id: bk.id,
      date: bk.when ? new Date(bk.when).toLocaleDateString() : "",
      time: bk.when
        ? new Date(bk.when).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      service: "",
      isoDate: iso,
    };

    ModalManager.open(
      <RescheduleBookingModal
        booking={booking}
        mode="suggest"
        onSuggest={async (datetime: string) => {
          try {
            const res = await fetch(`/api/booking/${bk.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ when: new Date(datetime).toISOString() }),
            });
            if (!res.ok) throw new Error("Failed to update booking time");
            showAlert("Booking time updated", () => {
              router.refresh();
            });
          } catch (err) {
            showAlert(String(err));
          }
        }}
      />,
    );
  }

  return (
    <div className="card table-card">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-[#B48B7F]">Bookings</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage user session bookings and appointments
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>No bookings</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th>Meeting Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-gray-50 transition-colors">
                  <td className="font-medium">{bk.name || "-"}</td>
                  <td className="text-gray-600">{bk.email || "-"}</td>
                  <td className="text-gray-600">
                    {bk.when ? new Date(bk.when).toLocaleString() : "-"}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        bk.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : bk.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bk.status || "pending"}
                    </span>
                  </td>
                  <td>
                    {bk.meetingId ? (
                      <a
                        href={`/connect/${bk.meetingId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#B48B7F] hover:underline inline-flex items-center gap-1"
                      >
                        Join
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>External link</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center  gap-2">
                      {/* Cancel - red */}
                      <button
                        type="button"
                        className="px-2 py-1.5 text-xs rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                        onClick={() => handleCancel(bk.id)}
                        aria-label="Cancel booking"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <title>Delete</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7m5 4v6m4-6v6M9 7V4h6v3"
                          />
                        </svg>
                        Cancel
                      </button>

                      {/* Suggest - blue */}
                      <button
                        type="button"
                        className="px-2 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-1"
                        onClick={() => openSuggestModal(bk)}
                        aria-label="Suggest time"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <title>Suggest time</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Suggest
                      </button>

                      {/* Confirm - green */}
                      <button
                        type="button"
                        className="px-2 py-1.5 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-1"
                        onClick={() => handleConfirm(bk.id)}
                        aria-label="Confirm booking"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <title>Confirm</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Confirm
                      </button>

                      {/* View - dark */}
                      <button
                        type="button"
                        className="px-2 py-1.5 text-xs rounded-md bg-[#2C3531] text-white hover:bg-[#B48B7F] transition-colors inline-flex items-center gap-1"
                        onClick={() => setOpenBooking(bk.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>View</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BookingModal booking={booking} onClose={() => setOpenBooking(null)} />
    </div>
  );
}
