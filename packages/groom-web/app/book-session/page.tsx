"use client";

import { useAuth } from "@/context/AuthContext";
import bookingService from "@/services/bookingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BookSessionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    when: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Razorpay SDK failed to load");
      toast.error("Payment gateway unavailable. Please try again.");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.when || !formData.reason) {
      setError("All fields are required");
      return;
    }

    const selectedDate = new Date(formData.when);
    if (selectedDate < new Date()) {
      setError("Please select a future date");
      return;
    }

    setStep(2);
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway is still loading. Please wait a moment and try again.");
      return;
    }

    if (!user) {
      router.push("/login?redirect=/book-session");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Initiate Booking
      const { booking, order } = await bookingService.initiate(formData);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency,
        name: "Groom Counseling",
        description: "Session Booking",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            await bookingService.verify({
              bookingId: booking.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Booking confirmed! Redirecting to your bookings...");
            setTimeout(() => router.push("/my-bookings"), 1000);
          } catch (err: any) {
            const message = err.message || "Payment verification failed";
            setError(message);
            toast.error(message);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: user?.phone || "",
        },
        theme: {
          color: "#B48B7F",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const message = err.message || "Failed to initiate payment. Please try again.";
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
      
      {/* Steps Indicator */}
      <div className="flex justify-center mb-8 gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#B48B7F] font-bold" : "text-gray-400"}`}>
          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">
            1
          </span>
          Details
        </div>
        <div className="w-12 h-0.5 self-center bg-gray-300"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#B48B7F] font-bold" : "text-gray-400"}`}>
          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">
            2
          </span>
          Payment
        </div>
      </div>

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

        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
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
              className="w-full bg-[#006442] text-white py-3 rounded-lg font-semibold hover:bg-[#004d32] transition-colors"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            {/* Session Summary */}
            <div className="bg-gray-50 p-6 rounded-lg text-left space-y-3 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Session Summary</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Session Type:</span> Personal Counseling (1 Hour)
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Scheduled For:</span>{" "}
                  {new Date(formData.when).toLocaleString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Topic:</span> {formData.reason}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-lg font-bold text-[#006442]">Total Amount: ₹500.00</p>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded}
              className="w-full bg-[#B48B7F] text-white py-3 rounded-lg font-semibold hover:bg-[#9e7b70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : razorpayLoaded ? "Pay & Book Now" : "Loading payment..."}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
