"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BookingButton from "@/components/BookingButton";
import { useAuth } from "@/context/AuthContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import bookingService, { type Booking } from "@/services/bookingService";
import { showErrorToast } from "@/utils/errorHandler";
import ModalManager from "@/utils/ModalManager";
import RescheduleBookingModal from "../bookings/RescheduleBookingModal";
import { myBookingsContent } from "##/content/my-bookings/my-bookings";

const MyBookingsPage = () => {
  const { isLoading: authLoading, isAuthorized } = useProtectedRoute();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setFetching(true);
      setError(null);
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err) {
      const error = showErrorToast(err);
      setError(error.message);
      setBookings([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchBookings();
    }
  }, [isAuthorized, user, fetchBookings]);

  const handleReschedule = async (booking: Booking) => {
    const bookingData = {
      id: booking.id,
      date: new Date(booking.when).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date(booking.when).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      service: booking.reason || "Counseling Session",
      isoDate: booking.when,
    };

    ModalManager.open(
      <RescheduleBookingModal
        booking={bookingData}
        mode="reschedule"
        onSuccess={() => {
          toast.success(myBookingsContent.card.successMessages.reschedule);
          fetchBookings();
        }}
      />,
    );
  };

  const handleCancel = async (bookingId: string) => {
    if (confirm(myBookingsContent.card.confirms.cancel)) {
      try {
        await bookingService.delete(bookingId);
        toast.success(myBookingsContent.card.successMessages.cancel);
        fetchBookings();
      } catch (err) {
        showErrorToast(err);
      }
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006442]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Redirect is handled by useProtectedRoute hook
  }

  const isAdmin =
    user?.roles?.includes("ADMIN") || user?.roles?.includes("SUPER_ADMIN");

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-[#2C3531]">
        {isAdmin ? myBookingsContent.header.adminTitle : myBookingsContent.header.userTitle}
      </h1>
      {isAdmin && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{myBookingsContent.header.adminAlert.title}</strong> {myBookingsContent.header.adminAlert.message}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <title>Error</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-red-700 font-medium">
              {myBookingsContent.error.title}
            </p>
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchBookings}
              className="text-sm text-red-700 hover:text-red-900 underline mt-2"
            >
              {myBookingsContent.error.retryButton}
            </button>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{myBookingsContent.empty.title}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {myBookingsContent.empty.title}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {myBookingsContent.empty.message}
          </p>
          <BookingButton className="bg-[#006442] text-white hover:bg-[#004d32] px-6 py-2 rounded-lg font-medium inline-block">
            {myBookingsContent.empty.ctaLabel}
          </BookingButton>
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
                            : booking.status === "completed"
                              ? "bg-blue-100 text-blue-800"
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
                {isAdmin && (
                  <div className="mb-2 space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{myBookingsContent.card.labels.user}</span> {booking.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{myBookingsContent.card.labels.email}</span>{" "}
                      {booking.email}
                    </p>
                  </div>
                )}
                {booking.meetingId && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {myBookingsContent.card.labels.meetingId}{" "}
                      <span className="font-mono text-gray-700">
                        {booking.meetingId}
                      </span>
                    </p>
                    {booking.status === "confirmed" && (
                      <a
                        href={`/connect/${booking.meetingId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#006442] hover:text-[#004d32] font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          role="img"
                          aria-labelledby="join-session-icon-1"
                        >
                          <title id="join-session-icon-1">{myBookingsContent.card.actions.join}</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        {myBookingsContent.card.actions.join}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                {booking.status === "confirmed" && booking.meetingId && (
                  <a
                    href={`/connect/${booking.meetingId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#006442] border border-[#006442] rounded-md hover:bg-[#004d32] transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      role="img"
                      aria-labelledby="join-session-icon-2"
                    >
                      <title id="join-session-icon-2">{myBookingsContent.card.actions.join}</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {myBookingsContent.card.actions.join}
                  </a>
                )}
                {booking.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReschedule(booking)}
                      className="px-4 py-2 text-sm font-medium text-[#006442] bg-white border border-[#006442] rounded-md hover:bg-green-50 transition-colors"
                    >
                      {myBookingsContent.card.actions.reschedule}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      {myBookingsContent.card.actions.cancel}
                    </button>
                  </>
                )}
                {isAdmin && booking.status === "confirmed" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReschedule(booking)}
                      className="px-4 py-2 text-sm font-medium text-[#006442] bg-white border border-[#006442] rounded-md hover:bg-green-50 transition-colors"
                    >
                      {myBookingsContent.card.actions.reschedule}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    >
                      {myBookingsContent.card.actions.cancel}
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
