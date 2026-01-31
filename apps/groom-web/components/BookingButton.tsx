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
  const [hasBooking, setHasBooking] = useState(false);

  // Still checking localStorage for legacy reasons, but auth blocked first
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tqs_booking");
      if (raw) setHasBooking(true);
    } catch (_e) {
      // ignore
    }
  }, []);

  const onClick = useCallback(() => {
    if (!user) {
      if (onLoginRequest) onLoginRequest();
      return;
    }

    if (hasBooking) {
      router.push("/bookings");
      return;
    }
    ModalManager.open(<BookingModal />);
  }, [user, hasBooking, router, onLoginRequest]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? (hasBooking ? "Manage Booking" : "Book Session")}
    </button>
  );
};

export default BookingButton;
