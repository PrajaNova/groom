"use client";
import { CheckCircle, Clock, Copy, Trash2, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  name: string;
  email: string;
  when: string;
  status: BookingStatus;
  meetingId?: string;
}

type Tab = "today" | "active" | "cancelled";

export default function BookingsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (activeTab === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        params.append("fromDate", today.toISOString());
        params.append("toDate", endOfDay.toISOString());
      } else if (activeTab === "active") {
        // Active usually implies pending or confirmed
        // Just fetching all sorted by date for now, can filter client side or API
        // Asking API for pending,confirmed
        // params.append("status", "pending,confirmed"); // If API supports comma sep
      } else if (activeTab === "cancelled") {
        params.append("status", "cancelled");
      }

      const res = await fetch(`/api/bookings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Client side filtering for 'active' if API doesn't support complex OR
      let filtered = data;
      if (activeTab === "active") {
        filtered = data.filter((b: Booking) =>
          ["pending", "confirmed"].includes(b.status),
        );
      }

      setBookings(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const handleAction = async (id: string, action: "confirm" | "cancel") => {
    try {
      const method = action === "cancel" ? "DELETE" : "PUT";
      const body =
        action === "confirm"
          ? JSON.stringify({ status: "confirmed" })
          : undefined;

      const res = await fetch(`/api/bookings/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) throw new Error("Action failed");

      toast.success(`Booking ${action}ed`);
      fetchBookings();
    } catch (e) {
      toast.error("Failed to update booking");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "active"
              ? "text-[#B48B7F]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active Bookings
          {activeTab === "active" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B48B7F]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("today")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "today"
              ? "text-[#B48B7F]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Today's Schedule
          {activeTab === "today" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B48B7F]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "cancelled"
              ? "text-[#B48B7F]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cancelled
          {activeTab === "cancelled" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B48B7F]" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-gray-200 text-gray-500">
          No bookings found in this section
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Scheduled For
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {booking.name}
                    </div>
                    <div className="text-gray-500 text-xs">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      {new Date(booking.when).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleAction(booking.id, "confirm")}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Confirm Booking"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}

                      {booking.meetingId && (
                        <a
                          href={`/meet/${booking.meetingId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Join Meeting"
                        >
                          <Video size={18} />
                        </a>
                      )}

                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleAction(booking.id, "cancel")}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Cancel Booking"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
