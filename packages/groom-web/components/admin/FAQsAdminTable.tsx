"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FAQModal from "./FAQModal";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

type Props = {
  faqs: FAQ[];
};

export default function FAQsAdminTable({ faqs }: Props) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  async function handleDelete(id: string) {
    showConfirm("Delete this FAQ? This action cannot be undone.", async () => {
      try {
        const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete FAQ");
        showAlert("FAQ deleted", () => router.refresh());
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  return (
    <div className="card table-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-[#B48B7F]">FAQs</h3>
          <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions on home page</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#2C3531] text-white font-semibold rounded-lg shadow-md hover:bg-[#B48B7F] transition-colors flex items-center gap-2"
          onClick={() => {
            setSelectedFAQ(null);
            setOpenModal(true);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add FAQ
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Question</th>
              <th>Answer Preview</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="w-20 font-mono">{f.order}</td>
                <td className="font-medium max-w-xs truncate">{f.question}</td>
                <td className="max-w-md truncate text-gray-500">{f.answer}</td>
                <td className="text-right flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setSelectedFAQ(f);
                      setOpenModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No FAQs found. Add your first FAQ to show it on the home page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FAQModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        faq={selectedFAQ}
      />
    </div>
  );
}
