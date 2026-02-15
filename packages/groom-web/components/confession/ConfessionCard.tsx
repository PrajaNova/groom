"use client";

import type React from "react";
import ModalManager from "##/utils/ModalManager";
import ConfessionModal from "./ConfessionModal";

interface ConfessionProps {
  id: string;
  content: string;
  createdAt: string | Date;
}

const ConfessionCard: React.FC<ConfessionProps> = ({
  id,
  content,
  createdAt,
}) => {
  const date = new Date(createdAt);
  const timeString =
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) +
    ", " +
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <button
      onClick={() => {
        ModalManager.open(
          <ConfessionModal confession={{ id, content, createdAt }} />,
        );
      }}
      type="button"
      className="flex flex-col h-full bg-stone-50/80 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B48B7F]"
      aria-label="Read full confession"
    >
      <p className="font-lora text-gray-800 italic text-lg whitespace-pre-wrap flex-grow">
        {content}
      </p>
      <div className="flex justify-between items-center mt-6 pt-3 border-t border-stone-200">
        <p className="text-xs text-gray-400">{timeString}</p>
        <p className="text-sm font-medium text-gray-500">— Anonymous</p>
      </div>
    </button>
  );
};

export default ConfessionCard;
