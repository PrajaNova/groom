import BlogsAdminTable from "##/components/admin/BlogsAdminTable";
import groomService from "##/services/groomService";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminBlogsPage() {
  const blogs = await groomService.getBlogs();

  const blogRows = blogs.map((b: any) => {
    return {
      id: String(b.id ?? ""),
      title: String(b.title ?? ""),
      slug: String(b.slug ?? ""),
    };
  });
  return <BlogsAdminTable blogs={blogRows} />;
}
