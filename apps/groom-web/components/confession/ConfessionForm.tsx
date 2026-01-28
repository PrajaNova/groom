"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useState } from "react";

const MAX_CHARS = 500;

const ConfessionForm: React.FC = () => {
  const [confessionMessage, setConfessionMessage] = useState("");
  const [shareDetails, setShareDetails] = useState(false);
  const [submitterDetails, setSubmitterDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const showMessage = useCallback((text: string, color: string) => {
    setMessage({ text, color });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = confessionMessage.trim();
    if (!text) {
      showMessage(
        "Please enter your thought before submitting.",
        "text-red-500",
      );
      return;
    }

    setIsSubmitting(true);
    showMessage("Submitting your thought...", "text-[#B48B7F]");
    try {
      type SubmitterDetails = { name?: string; email?: string; phone?: string };
      type SubmitPayload = {
        content: string;
        submitterDetails?: SubmitterDetails;
      };

      const payload: SubmitPayload = { content: text };
      if (shareDetails) payload.submitterDetails = submitterDetails;

      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to submit");
      // Clear form and reset state
      setConfessionMessage("");
      setShareDetails(false);
      setSubmitterDetails({ name: "", email: "", phone: "" });
      showMessage("Thought released! Thank you for sharing.", "text-[#2C3531]");
      try {
        router.refresh();
      } catch {}
    } catch (_err) {
      showMessage(
        "Error: Could not release thought. Please try again.",
        "text-red-500",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_CHARS - confessionMessage.length;

  return (
    <section className="bg-white p-8 rounded-xl shadow-2xl mb-20 border-t-4 border-[#B48B7F]">
      <h3 className="text-3xl font-bold text-[#2C3531] mb-6 text-center">
        Share Your Thought
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          value={confessionMessage}
          onChange={(e) => setConfessionMessage(e.target.value)}
          rows={5}
          placeholder="Type your anonymous thought here. Let it go."
          maxLength={MAX_CHARS}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-[#B48B7F] focus:border-[#B48B7F] transition duration-200 text-[#2C3531] placeholder-gray-500 bg-gray-50/70 resize-none"
          required
        />
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="shareDetails"
              name="shareDetails"
              type="checkbox"
              checked={shareDetails}
              onChange={(e) => setShareDetails(e.target.checked)}
              className="h-4 w-4 text-[#B48B7F] focus:ring-[#B48B7F] border-gray-300 rounded"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="shareDetails" className="font-medium text-gray-700">
              Do you want to share your details with a doctor to connect you?
            </label>
            <p className="text-xs text-gray-500">
              Optional — only if you want a doctor to reach out.
            </p>
          </div>
        </div>

        {shareDetails && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
                <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={submitterDetails.name}
                onChange={(e) =>
                  setSubmitterDetails((p) => ({ ...p, name: e.target.value }))
                }
                required={shareDetails}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={submitterDetails.email}
                onChange={(e) =>
                  setSubmitterDetails((p) => ({ ...p, email: e.target.value }))
                }
                required={shareDetails}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={submitterDetails.phone}
                onChange={(e) =>
                  setSubmitterDetails((p) => ({ ...p, phone: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              remainingChars < 0 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {remainingChars} characters remaining
          </span>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              confessionMessage.trim().length === 0 ||
              (shareDetails &&
                (!submitterDetails.name.trim() ||
                  !submitterDetails.email.trim()))
            }
            className="bg-[#2C3531] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B48B7F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? shareDetails
                ? "Submitting..."
                : "Submitting..."
              : shareDetails
                ? "Submit with details"
                : "Submit Anonymously"}
          </button>
        </div>
        {message && (
          <p className={`text-center text-sm font-medium ${message.color}`}>
            {message.text}
          </p>
        )}
      </form>
    </section>
  );
};

export default ConfessionForm;
