"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import bookingService from "@/services/bookingService";
import ModalManager from "@/utils/ModalManager";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function BookSessionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "",
    when: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Store the booking context from the initiate call
  const bookingRef = useRef<{ orderId: string; bookingId: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/book-session");
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user, isLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Validate form before showing PayPal buttons
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.serviceType ||
      !formData.when ||
      !formData.reason
    ) {
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

    setError("");
    setFormValid(true);
    setShowPayment(true);
  };

  // Called by PayPal SDK when user clicks the PayPal button
  const handleCreateOrder = async (): Promise<string> => {
    try {
      const response = await bookingService.initiate(formData);
      bookingRef.current = {
        orderId: response.order.id,
        bookingId: response.booking.id,
      };
      return response.order.id;
    } catch (err: any) {
      const message =
        err.message || "Failed to initiate booking. Please try again.";
      setError(message);
      toast.error(message);
      throw err; // Let PayPal SDK handle the error
    }
  };

  // Called by PayPal SDK after user approves the payment
  const handlePaymentSuccess = async (paypalOrderId: string) => {
    if (!bookingRef.current) {
      setError("Booking context lost. Please try again.");
      setShowPayment(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const booking = await bookingService.verify({
        bookingId: bookingRef.current.bookingId,
        paypalOrderId,
      });

      ModalManager.open(
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-labelledby="success-icon-title"
            >
              <title id="success-icon-title">Success</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-6">
            Your session is confirmed. You will receive an email shortly with
            the meeting link and receipt.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Service:</span>{" "}
              {formData.serviceType}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Requested Date:</span>{" "}
              {new Date(booking.when).toLocaleString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600 font-medium italic">
                Confirmed
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              ModalManager.close();
              router.push("/my-bookings");
            }}
            className="w-full bg-[#006442] text-white py-3 rounded-lg font-semibold hover:bg-[#004d32] transition-colors"
          >
            View My Bookings
          </button>
        </div>,
      );
    } catch (err: any) {
      const message =
        err.message || "Failed to verify payment. Please contact support.";
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

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#2C3531] mb-8 text-center">
        {showPayment ? "Complete Payment" : "Book Your Session"}
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
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
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {showPayment ? (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4 text-center">
              Please complete your payment via PayPal to confirm your booking.
            </p>
            {loading ? (
              <div className="text-center py-4">Processing...</div>
            ) : !paypalClientId ? (
              <div className="text-center py-4 text-red-600">
                Payment gateway is not configured. Please contact support.
              </div>
            ) : (
              <div className="relative z-0 min-h-[150px]">
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={handleCreateOrder}
                    onApprove={async (data) => {
                      if (data.orderID) {
                        await handlePaymentSuccess(data.orderID);
                      }
                    }}
                    onCancel={() => {
                      setError("Payment was cancelled. You can try again.");
                      bookingRef.current = null;
                    }}
                    onError={(err) => {
                      console.error("PayPal SDK error:", err);
                      setError(
                        "An error occurred with PayPal checkout. Please try again.",
                      );
                      bookingRef.current = null;
                      setShowPayment(false);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setShowPayment(false);
                bookingRef.current = null;
                setError("");
              }}
              className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
            >
              ← Back to booking form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="full-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="full-name"
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
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email-address"
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
              <label
                htmlFor="service-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type
              </label>
              <select
                id="service-type"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange as any}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006442] focus:border-transparent transition bg-white"
              >
                <option value="">Select a service</option>
                <option value="Self Help">Self Help</option>
                <option value="Couple Therapy">Couple Therapy</option>
                <option value="Career Consultation">Career Consultation</option>
                <option value="Numerology">Numerology</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="preferred-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Date & Time
              </label>
              <input
                id="preferred-date"
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
              <label
                htmlFor="discussion-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                What would you like to discuss?
              </label>
              <textarea
                id="discussion-reason"
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
        )}
      </div>
    </div>
  );
}
