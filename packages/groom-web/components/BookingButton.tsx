"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ModalManager from "##/utils/ModalManager";
import BookingModal from "./BookingModal";

const BookingButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const router = useRouter();
  const [hasBooking, setHasBooking] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tqs_booking");
      if (raw) setHasBooking(true);
    } catch (_e) {
      // ignore
    }
  }, []);

  const onClick = useCallback(() => {
    if (hasBooking) {
      router.push("/bookings");
      return;
    }
    ModalManager.open(<BookingModal />);
  }, [hasBooking, router]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? (hasBooking ? "Manage Booking" : "Book Session")}
    </button>
  );
};

export default BookingButton;
