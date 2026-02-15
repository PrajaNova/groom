"use client";

import type React from "react";
import { useRef } from "react";
import ModalManager from "##/utils/ModalManager";

// Local type (avoid importing server-only Prisma types into client bundle)
interface Confession {
  id: string;
  content: string;
  createdAt: string | Date;
}

interface ConfessionModalProps {
  confession: Confession;
}

const ConfessionModal: React.FC<ConfessionModalProps> = ({ confession }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      ModalManager.close();
    }
  };
  if (!confession) return null;

  const date =
    typeof confession.createdAt === "string"
      ? new Date(confession.createdAt)
      : confession.createdAt;

  const timeString =
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    ", " +
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div
      ref={modalRef}
      onClick={handleOutsideClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") ModalManager.close();
      }}
      tabIndex={-1}
      className="fixed flex inset-0 bg-opacity-70 z-[100] items-center justify-center "
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 relative"
      >
        <button
          type="button"
          onClick={() => ModalManager.close()}
          className="absolute top-4 right-4 text-[#2C3531] hover:text-red-500 transition"
          aria-label="Close modal"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="false"
          >
            <title>Close</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <div className="bg-stone-50/80 rounded-lg p-6">
          <p className="font-lora text-gray-800 italic text-xl whitespace-pre-wrap">
            {confession.content}
          </p>
          <div className="flex justify-between items-center mt-6 pt-3 border-t border-stone-200">
            <p className="text-sm text-gray-400">{timeString}</p>
            <p className="text-base font-medium text-gray-500">— Anonymous</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionModal;
