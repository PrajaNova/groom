"use client";

import { useRouter } from "next/navigation";
import { showAlert, showConfirm } from "##/utils/modalHelpers";

type ConfessionRow = { id: string; slug?: string; content?: string };

type Props = { confessions: ConfessionRow[] };

export default function ConfessionsAdminTable({ confessions }: Props) {
  const router = useRouter();

  async function handleDeleteConfession(id: string) {
    showConfirm(
      "Delete this confession? This action cannot be undone.",
      async () => {
        try {
          const res = await fetch(`/api/confessions/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete confession");
          showAlert("Confession deleted", () => router.refresh());
        } catch (err) {
          showAlert(String(err));
        }
      },
    );
  }

  return (
    <div className="card table-card">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-[#B48B7F]">Confessions</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage anonymous user confessions
        </p>
      </div>

      {confessions.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>No confessions</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500">No confessions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Preview</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {confessions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="font-mono text-sm text-gray-600">
                    {c.id.slice(0, 8)}...
                  </td>
                  <td className="max-w-md">
                    <p className="text-gray-700 truncate">{c.content ?? "-"}</p>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded-md bg-white border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-2 transition-colors"
                      onClick={() => handleDeleteConfession(c.id)}
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
    </div>
  );
}
