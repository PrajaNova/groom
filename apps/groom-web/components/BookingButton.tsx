"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "##/context/AuthContext";
import ModalManager from "##/utils/ModalManager";
import BookingModal from "./BookingModal";

const BookingButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
  onLoginRequest?: () => void;
}> = ({ className, children, onLoginRequest }) => {
  const router = useRouter();
  const { user } = useAuth();

  const onClick = useCallback(() => {
    if (!user) {
      if (onLoginRequest) {
        onLoginRequest();
      } else {
        router.push("/auth/login");
      }
      return;
    }

    ModalManager.open(<BookingModal />);
  }, [user, router, onLoginRequest]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? "Book Session"}
    </button>
  );
};

export default BookingButton;
