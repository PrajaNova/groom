"use client";

import { useAuth } from "@/context/AuthContext";
import bookingService from "@/services/bookingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import ModalManager from "@/utils/ModalManager";

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
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => alert("Razorpay SDK failed to load. Are you online?");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    } else if (!isLoading) {
      // If not logged in, prompt login
      ModalManager.open(<LoginModal isOpen={true} onClose={() => {
        if (!user) router.push("/"); // If closed without login, go home
        else ModalManager.close();
      }} />);
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      ModalManager.open(<LoginModal isOpen={true} onClose={() => ModalManager.close()} />);
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment gateway is loading. Please wait...");
      return;
    }
    setLoading(true);

    try {
      // 1. Initiate Booking
      const { booking, order } = await bookingService.initiate(formData);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890", // Replace with env var
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
            alert("Booking Confirmed!");
            router.push("/my-bookings");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
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
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-[#2C3531] mb-8 text-center">Book Your Session</h1>
      
      {/* Steps Indicator */}
      <div className="flex justify-center mb-8 gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#B48B7F] font-bold" : "text-gray-400"}`}>
          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">1</span>
          Details
        </div>
        <div className={`w-12 h-0.5 self-center bg-gray-300`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#B48B7F] font-bold" : "text-gray-400"}`}>
          <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center border-current">2</span>
          Payment
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">When would you like to connect?</label>
              <input
                type="datetime-local"
                name="when"
                value={formData.when}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">What would you like to discuss?</label>
              <textarea
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2C3531] text-white py-3 rounded-lg font-semibold hover:bg-[#B48B7F] transition-colors"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
              <p><strong>Session:</strong> Counseling Session (1 Hour)</p>
              <p><strong>Date:</strong> {new Date(formData.when).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹500.00</p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#B48B7F] text-white py-3 rounded-lg font-semibold hover:bg-[#9e7b70] transition-colors disabled:opacity-70"
            >
              {loading ? "Processing..." : "Pay & Book Now"}
            </button>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
