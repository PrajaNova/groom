import BlogsAdminTable from "@/components/admin/BlogsAdminTable";
import { fetchServer } from "@/services/serverApi";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminBlogsPage() {
  const blogs = await fetchServer<any[]>("/api/blogs");

  const blogRows = blogs.map((b: any) => ({
    id: String(b.id ?? ""),
    title: String(b.title ?? ""),
    slug: String(b.slug ?? ""),
  }));

  return <BlogsAdminTable blogs={blogRows} />;
}
