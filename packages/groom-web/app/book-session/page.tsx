"use client";

import { useAuth } from "@/context/AuthContext";
import bookingService from "@/services/bookingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalManager from "@/utils/ModalManager";

export default function BookSessionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    when: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push("/login?redirect=/book-session");
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.when || !formData.reason) {
      setError("All fields are required");
      return;
    }

    const selectedDate = new Date(formData.when);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Please select today's date or a future date");
      return;
    }

    if (!user) {
      router.push("/login?redirect=/book-session");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const booking = await bookingService.create(formData);
      
      ModalManager.open(
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your counseling session has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Session Date:</span>{" "}
              {new Date(booking.when).toLocaleString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {booking.meetingId && (
              <>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold">Meeting ID:</span> {booking.meetingId}
                </p>
                <a
                  href={`/connect/${booking.meetingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#006442] hover:text-[#004d32] font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join Session Link
                </a>
              </>
            )}
          </div>
          <button
            onClick={() => {
              ModalManager.close();
              router.push("/my-bookings");
            }}
            className="w-full bg-[#006442] text-white py-3 rounded-lg font-semibold hover:bg-[#004d32] transition-colors"
          >
            View My Bookings
          </button>
        </div>
      );
    } catch (err: any) {
      const message = err.message || "Failed to create booking. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2EF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006442]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#2C3531] mb-8 text-center">
        Book Your Session
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <title>Error</title>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006442] focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006442] focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                name="when"
                value={formData.when}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006442] focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please select a date at least 24 hours in advance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to discuss?
              </label>
              <textarea
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006442] focus:border-transparent transition"
                placeholder="Tell us about your situation..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006442] text-white py-3 rounded-lg font-semibold hover:bg-[#004d32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Session"}
            </button>
          </form>
        </div>
      </div>
  );
}
