"use client";
import { Calendar, LogOut, PenTool, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export type AdminSection = "bookings" | "confessions" | "blogs" | "roles";

interface SidebarProps {
  currentSection?: AdminSection;
  onSectionChange?: (section: AdminSection) => void;
}

export default function Sidebar({
  currentSection = "bookings",
  onSectionChange,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out");
        router.push("/admin/login");
      }
    } catch (e) {
      console.error(e);
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { key: "bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { key: "confessions", label: "Confessions", icon: <Shield size={20} /> },
    { key: "blogs", label: "Blogs", icon: <PenTool size={20} /> },
    { key: "roles", label: "Roles Management", icon: <User size={20} /> },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-[#B48B7F]">Groom</h1>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
          God Mode
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSectionChange?.(item.key as AdminSection)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentSection === item.key
                ? "bg-[#B48B7F]/10 text-[#B48B7F] font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
