"use client";

import ModalManager from "##/utils/ModalManager";

type Props = {
  title?: string;
  message: string;
  onClose?: () => void;
};

export default function AlertModal({ title, message, onClose }: Props) {
  function handleClose() {
    ModalManager.close();
    onClose?.();
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#2C3531]">
          {title ?? "Notice"}
        </h3>
      </div>
      <p className="text-sm text-gray-700 mb-6 whitespace-pre-wrap">
        {message}
      </p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 rounded-md bg-[#2C3531] text-white"
        >
          OK
        </button>
      </div>
    </div>
  );
}
