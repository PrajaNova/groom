import Link from "next/link";
import { fetchServer } from "@/services/serverApi";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminDashboard() {
  const [blogs, bookings, confessions] = await Promise.all([
    fetchServer<any[]>("/api/blogs"),
    fetchServer<any[]>("/api/bookings"),
    fetchServer<any[]>("/api/confessions"),
  ]);

  const stats = [
    {
      label: "Total Blogs",
      value: blogs.length,
      href: "/admin/blogs",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Blogs</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      href: "/admin/bookings",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Bookings</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Confessions",
      value: confessions.length,
      href: "/admin/confessions",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Confessions</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card table-card">
        <h1 className="text-4xl font-bold text-[#2C3531] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group block card table-card hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-[#2C3531]">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-[#B48B7F] group-hover:underline">
              View all
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Arrow</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card table-card">
        <h2 className="text-2xl font-bold text-[#2C3531] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/blogs"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#B48B7F] hover:bg-gray-50 transition-all"
          >
            <svg
              className="w-6 h-6 text-[#B48B7F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Add blog</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-medium">Add New Blog</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#B48B7F] hover:bg-gray-50 transition-all"
          >
            <svg
              className="w-6 h-6 text-[#B48B7F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>View bookings</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">View Bookings</span>
          </Link>
          <Link
            href="/admin/confessions"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#B48B7F] hover:bg-gray-50 transition-all"
          >
            <svg
              className="w-6 h-6 text-[#B48B7F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Manage confessions</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">Manage Confessions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
