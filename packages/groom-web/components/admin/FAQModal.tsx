"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type FAQ = {
  id?: string;
  question: string;
  answer: string;
  order: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQ | null;
};

export default function FAQModal({ isOpen, onClose, faq }: Props) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setOrder(faq.order);
    } else {
      setQuestion("");
      setAnswer("");
      setOrder(0);
    }
  }, [faq, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { question, answer, order };
      const url = faq?.id ? `/api/faqs/${faq.id}` : "/api/faqs";
      const method = faq?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to save FAQ");
      }

      toast.success(faq?.id ? "FAQ updated" : "FAQ created");
      onClose();
      router.refresh();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-[#B48B7F]">
            {faq ? "Edit FAQ" : "Add FAQ"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#2C3531] hover:text-red-500 transition"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#2C3531] text-white rounded-lg hover:bg-[#B48B7F] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
