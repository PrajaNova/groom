"use client";

import ModalManager from "##/utils/ModalManager";

type Props = {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  function handleConfirm() {
    ModalManager.close();
    onConfirm();
  }

  function handleCancel() {
    ModalManager.close();
    onCancel?.();
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#2C3531]">
          {title ?? "Confirm"}
        </h3>
      </div>
      <p className="text-sm text-gray-700 mb-6 whitespace-pre-wrap">
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-md border text-[#2C3531]"
        >
          No
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 rounded-md bg-[#2C3531] text-white"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
