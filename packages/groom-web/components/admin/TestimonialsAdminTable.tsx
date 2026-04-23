"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TestimonialModal from "./TestimonialModal";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  createdAt?: string;
};

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialsAdminTable({ testimonials }: Props) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  async function handleDelete(id: string) {
    showConfirm("Delete this testimonial? This action cannot be undone.", async () => {
      try {
        const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete testimonial");
        showAlert("Testimonial deleted", () => router.refresh());
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  return (
    <div className="card table-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-[#B48B7F]">Testimonials</h3>
          <p className="text-sm text-gray-500 mt-1">Manage what clients say on the home page</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#2C3531] text-white font-semibold rounded-lg shadow-md hover:bg-[#B48B7F] transition-colors flex items-center gap-2"
          onClick={() => {
            setSelectedTestimonial(null);
            setOpenModal(true);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Quote Preview</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-medium whitespace-nowrap">{t.author}</td>
                <td className="max-w-md truncate text-gray-500">{t.quote}</td>
                <td className="text-right flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setSelectedTestimonial(t);
                      setOpenModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">
                  No testimonials found. Add your first testimonial to show it on the home page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TestimonialModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}
