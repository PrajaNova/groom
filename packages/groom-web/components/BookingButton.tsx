"use client";

import { useRouter, usePathname } from "next/navigation";
import type React from "react";
import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const BookingButton: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const onClick = useCallback(() => {
    if (!user) {
      // Redirect to login with current page as redirect target
      const redirectUrl = pathname === "/" ? "/book-session" : pathname;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    // Navigate to Booking Page if authenticated
    router.push("/book-session");
  }, [user, router, pathname]);

  return (
    <button onClick={onClick} type="button" className={className ?? "btn-sm"}>
      {children ?? "Book Session"}
    </button>
  );
};

export default BookingButton;
