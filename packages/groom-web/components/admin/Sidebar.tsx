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
    {
      key: "users",
      label: "Users",
      href: "/admin/users",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <title>Users</title>
          <path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "services",
      label: "Services",
      href: "/admin/services",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <title>Services</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547a3.374 3.374 0 00-.83 1.57h-1.387a3.374 3.374 0 00-.83-1.57l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      key: "faqs",
      label: "FAQs",
      href: "/admin/faqs",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <title>FAQs</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      ),
    },
    {
      key: "testimonials",
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: (
        <svg
          role="img"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <title>Testimonials</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
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
