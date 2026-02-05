"use client";
import { Check, Edit2, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Confession {
  id: string;
  content: string;
  createdAt: string;
}

export default function ConfessionsSection() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchConfessions = async () => {
    try {
      const res = await fetch("/api/confessions");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setConfessions(data);
    } catch (e) {
      toast.error("Failed to load confessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/confessions/${id}`, { method: "DELETE" });
      toast.success("Confession deleted");
      fetchConfessions();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const startEdit = (c: Confession) => {
    setEditingId(c.id);
    setEditContent(c.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/confessions/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error("Update failed");

      toast.success("Updated successfully");
      setEditingId(null);
      fetchConfessions();
    } catch (e) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Confessions</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {confessions.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group"
            >
              {editingId === c.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={saveEdit}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-700 leading-relaxed font-serif italic text-lg opacity-90">
                    "{c.content}"
                  </p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(c)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {confessions.length === 0 && (
            <div className="text-gray-500">No confessions yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
