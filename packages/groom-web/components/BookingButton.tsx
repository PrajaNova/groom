"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback } from "react";
import ModalManager from "@/utils/ModalManager";
import BookingModal from "./BookingModal";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";

const BookingButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const router = useRouter();
  const { user } = useAuth();

  const onClick = useCallback(() => {
    if (!user) {
      // Open Login Modal if not authenticated
      ModalManager.open(
        <LoginModal 
          isOpen={true} 
          onClose={() => ModalManager.close()} 
        />
      );
      return;
    }

    // Open Booking Modal if authenticated
    ModalManager.open(<BookingModal />);
  }, [user]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? "Book Session"}
    </button>
  );
};

export default BookingButton;
