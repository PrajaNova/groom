"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceModal from "./ServiceModal";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type Service = {
  id: string;
  title: string;
  description: string;
  iconType: string;
  colorType: string;
  order: number;
};

type Props = {
  services: Service[];
};

export default function ServicesAdminTable({ services }: Props) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  async function handleDelete(id: string) {
    showConfirm("Delete this service? This action cannot be undone.", async () => {
      try {
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete service");
        showAlert("Service deleted", () => router.refresh());
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  return (
    <div className="card table-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-[#B48B7F]">Services</h3>
          <p className="text-sm text-gray-500 mt-1">Manage expertise sections shown on home page</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#2C3531] text-white font-semibold rounded-lg shadow-md hover:bg-[#B48B7F] transition-colors flex items-center gap-2"
          onClick={() => {
            setSelectedService(null);
            setOpenModal(true);
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Icon</th>
              <th>Color</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="w-20 font-mono">{s.order}</td>
                <td className="font-medium">{s.title}</td>
                <td>{s.iconType}</td>
                <td>{s.colorType}</td>
                <td className="text-right flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setSelectedService(s);
                      setOpenModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No services found. Add your first service to show it on the home page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ServiceModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        service={selectedService}
      />
    </div>
  );
}
