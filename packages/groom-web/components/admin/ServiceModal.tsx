"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Service = {
  id?: string;
  title: string;
  description: string;
  iconType: string;
  colorType: string;
  order: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
};

const ICON_TYPES = [
  { value: "self-help", label: "Self Help" },
  { value: "couple-therapy", label: "Couple Therapy" },
  { value: "career-consultation", label: "Career Consultation" },
  { value: "numerology", label: "Numerology" },
];

const COLOR_TYPES = [
  { value: "blue", label: "Blue (Standard)" },
  { value: "rose", label: "Rose (Warm)" },
  { value: "amber", label: "Amber (Bright)" },
  { value: "purple", label: "Purple (Royal)" },
];

export default function ServiceModal({ isOpen, onClose, service }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconType, setIconType] = useState(ICON_TYPES[0].value);
  const [colorType, setColorType] = useState(COLOR_TYPES[0].value);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setIconType(service.iconType);
      setColorType(service.colorType);
      setOrder(service.order);
    } else {
      setTitle("");
      setDescription("");
      setIconType(ICON_TYPES[0].value);
      setColorType(COLOR_TYPES[0].value);
      setOrder(0);
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, description, iconType, colorType, order };
      const url = service?.id ? `/api/services/${service.id}` : "/api/services";
      const method = service?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to save service");
      }

      toast.success(service?.id ? "Service updated" : "Service created");
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
            {service ? "Edit Service" : "Add Service"}
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
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Icon Type</label>
              <select
                value={iconType}
                onChange={(e) => setIconType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              >
                {ICON_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Type</label>
              <select
                value={colorType}
                onChange={(e) => setColorType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B48B7F] focus:border-[#B48B7F]"
              >
                {COLOR_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
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
              {loading ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
