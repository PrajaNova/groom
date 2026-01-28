"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

/**
 * Wrapper that conditionally renders Header and Footer
 * based on current route (excludes admin routes)
 */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes: no header/footer
    return <>{children}</>;
  }

  // Normal routes: include header and footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
