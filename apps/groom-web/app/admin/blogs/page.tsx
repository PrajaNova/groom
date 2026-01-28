import BlogsAdminTable from "##/components/admin/BlogsAdminTable";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminBlogsPage() {
  const res = await fetch("http://localhost:3004/blogs", { cache: "no-store" });
  const blogs = res.ok ? await res.json() : [];

  const blogRows = blogs.map((b: any) => {
    return {
      id: String(b.id ?? ""),
      title: String(b.title ?? ""),
      slug: String(b.slug ?? ""),
    };
  });
  return <BlogsAdminTable blogs={blogRows} />;
}
