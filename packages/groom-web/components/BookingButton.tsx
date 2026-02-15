"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import ModalManager from "@/utils/ModalManager";

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
        <LoginModal isOpen={true} onClose={() => ModalManager.close()} />,
      );
      return;
    }

    // Navigate to Booking Page if authenticated
    router.push("/book-session");
  }, [user, router]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? "Book Session"}
    </button>
  );
};

export default BookingButton;
