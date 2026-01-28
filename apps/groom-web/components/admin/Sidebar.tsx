"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const items = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/admin",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Dashboard</title>
          <path
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      key: "blogs",
      label: "Blogs",
      href: "/admin/blogs",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Blogs</title>
          <path
            d="M4 6H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "confessions",
      label: "Confessions",
      href: "/admin/confessions",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <title>Confessions</title>
          <path
            d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 1.657.504 3.191 1.365 4.48L4 20l3.52-1.365A7.962 7.962 0 0012 20z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "bookings",
      label: "Bookings",
      href: "/admin/bookings",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <title>Bookings</title>
          <path
            d="M21 10V7a2 2 0 00-2-2h-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="7"
            y="3"
            width="10"
            height="4"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="brand">Groom</div>
      <p className="brand-sub">Admin Panel</p>
      <nav aria-label="Admin navigation">
        <ul>
          {items.map((it) => {
            const active =
              it.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(it.href);
            return (
              <li
                key={it.key}
                className={`sidebar-item ${active ? "active" : ""}`}
              >
                <Link href={it.href} className="sidebar-link">
                  <span className="icon" aria-hidden>
                    {it.icon}
                  </span>
                  <span className="label">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-link w-full text-left hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="icon" aria-hidden>
            <svg
              role="img"
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <title>Logout</title>
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
