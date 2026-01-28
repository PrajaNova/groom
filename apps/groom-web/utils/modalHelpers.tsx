"use client";

import AlertModal from "##/components/common/AlertModal";
import ConfirmModal from "##/components/common/ConfirmModal";
import ModalManager from "##/utils/ModalManager";

export function showConfirm(
  message: string,
  onYes: () => void,
  onNo?: () => void,
  title?: string,
) {
  ModalManager.open(
    <ConfirmModal
      message={message}
      title={title}
      onConfirm={onYes}
      onCancel={onNo}
    />,
  );
}

export function showAlert(
  message: string,
  onClose?: () => void,
  title?: string,
) {
  ModalManager.open(
    <AlertModal message={message} title={title} onClose={onClose} />,
  );
}
