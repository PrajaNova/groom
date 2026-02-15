"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddBlogModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [readTime, setReadTime] = useState<number | "">("");
  // Only accept markdown format for blog content in admin UI
  const format: "markdown" = "markdown";
  const [imageSeed, setImageSeed] = useState("");
  const [contentFileName, setContentFileName] = useState<string | null>(null);
  const [contentText, setContentText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setContentFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setContentText(text);
    };
    reader.readAsText(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        slug,
        excerpt: excerpt || null,
        content: contentText,
        readTime: readTime === "" ? null : Number(readTime),
        imageSeed: imageSeed || "",
        category: category || null,
        format,
        author: author || undefined,
        publishedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to create blog");
      }

      toast.success("Blog created");
      onClose();
      router.refresh();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 transform transition-all duration-300 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold text-[#B48B7F]">Add Blog</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#2C3531] hover:text-red-500 transition"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-hidden="false"
            >
              <title>Close</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="blog-title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="blog-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="blog-slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                id="blog-slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="blog-excerpt"
              className="block text-sm font-medium text-gray-700"
            >
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="blog-content"
              className="block text-sm font-medium text-gray-700"
            >
              Content (Markdown .md)
            </label>
            <div className="mt-1">
              <input
                id="blog-content"
                type="file"
                accept=".md,text/markdown"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="blog-content"
                className="flex items-center justify-between cursor-pointer border-2 border-dashed border-gray-200 rounded-md px-4 py-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-hidden="false"
                  >
                    <title>Upload</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    Click to upload a .md file or drag here
                  </div>
                </div>
                <div className="text-sm text-teal-600">Browse</div>
              </label>
              {contentFileName && (
                <div className="text-sm text-gray-500 mt-2">
                  Loaded: {contentFileName}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="blog-readtime"
                className="block text-sm font-medium text-gray-700"
              >
                Read Time (min)
              </label>
              <input
                id="blog-readtime"
                type="number"
                min={0}
                value={readTime === "" ? "" : String(readTime)}
                onChange={(e) =>
                  setReadTime(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="blog-image"
                className="block text-sm font-medium text-gray-700"
              >
                Image Seed
              </label>
              <input
                id="blog-image"
                value={imageSeed}
                onChange={(e) => setImageSeed(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="blog-category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                id="blog-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="blog-author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <input
                id="blog-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#B48B7F] focus:border-[#B48B7F] sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="w-36 bg-white border border-red-200 text-red-600 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-red-50 flex items-center gap-2"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <title>Cancel</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              className="w-36 bg-[#2C3531] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-[#B48B7F]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
