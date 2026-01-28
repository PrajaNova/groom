"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddBlogModal from "##/components/admin/AddBlogModal";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type BlogRow = { id: string; title?: string; slug?: string };

type Props = {
  blogs: BlogRow[];
};

export default function BlogsAdminTable({ blogs }: Props) {
  const router = useRouter();
  const [openAdd, setOpenAdd] = useState(false);

  async function handleDeleteBlog(id: string) {
    showConfirm("Delete this blog? This action cannot be undone.", async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete blog");
        showAlert("Blog deleted", () => router.refresh());
      } catch (err) {
        showAlert(String(err));
      }
    });
  }

  return (
    <div className="card table-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-[#B48B7F]">Blogs</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage blog posts and articles
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#2C3531] text-white font-semibold rounded-lg shadow-md hover:bg-[#B48B7F] transition-colors duration-200 flex items-center gap-2"
          onClick={() => setOpenAdd(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <title>Add</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>No blogs</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 mb-4">No blogs yet</p>
          <button
            type="button"
            className="text-[#B48B7F] hover:underline"
            onClick={() => setOpenAdd(true)}
          >
            Create your first blog post
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Blog Name</th>
                <th>Slug</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="font-medium">{b.title ?? "Untitled"}</td>
                  <td className="text-gray-600">{b.slug}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-2 transition-colors"
                      onClick={() => handleDeleteBlog(b.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <title>Delete</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7m5 4v6m4-6v6M9 7V4h6v3"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddBlogModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}
