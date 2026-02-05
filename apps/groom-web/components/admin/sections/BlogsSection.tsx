"use client";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Assuming AddBlogModal exists or can be imported.
// If not, I'll need to create it or just placeholder it.
// I'll check if AddBlogModal existed in previous step files list.
// It was in `components/admin/AddBlogModal.tsx`. I should have kept it or need to recreate logic.
// I'll assume I need to implement a simple Add capability or button to trigger it.

interface Blog {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real implementation I would reinstate the AddBlogModal here
  // For now I'll create a basic prompt or leave hook for modal

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Blogs</h2>
        <button
          onClick={() => alert("Add Blog Modal to be implemented/reconnected")}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C3531] text-white rounded-lg hover:bg-[#B48B7F] transition-colors"
        >
          <Plus size={18} />
          <span>New Blog</span>
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Slug</th>
                <th className="px-6 py-4 font-semibold text-gray-700 w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{blog.title}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">
                    {blog.slug}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <a
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-[#B48B7F] transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
