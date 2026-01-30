// ... imports ...
import type { Metadata } from "next";
import Link from "next/link";
import AppImage from "##/components/AppImage";
import Markdown from "##/components/Markdown";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

async function getBlog(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs/${slug}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const blog = await getBlog(params.slug);
  return {
    title: blog?.title ?? "Blog",
    description: blog?.excerpt ?? undefined,
  };
}

export default async function BlogPage(props: Props) {
  const params = await props.params;
  const blog = await getBlog(params.slug);

  if (!blog) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold">Post not found</h2>
        <p className="mt-4">The blog you are looking for does not exist.</p>
        <Link href="/blogs" className="text-[#B48B7F] mt-4 inline-block">
          Back to blogs
        </Link>
      </main>
    );
  }

  const mdContent = blog.content ?? "";

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <article>
        <h1 className="text-4xl font-extrabold mb-4 text-[#2C3531]">
          {blog.title}
        </h1>
        {blog.excerpt ? (
          <>
            <p className="text-lg text-gray-700 mb-4">{blog.excerpt}</p>
            <hr className="border-t border-gray-200 my-6" />
          </>
        ) : null}
        <p className="text-sm text-gray-500 mb-6">
          By {blog.author} •{" "}
          {new Date(blog.publishedAt ?? "").toLocaleDateString()}
        </p>
        <div className="mb-8">
          <AppImage
            src={blog.imageSeed}
            width={1200}
            height={600}
            alt={blog.title}
            className="w-full h-auto object-cover rounded"
          />
        </div>
        <div className="prose dark:prose-invert max-w-none markdown-body">
          <Markdown content={mdContent} blogTitle={blog.title} className="" />
        </div>
      </article>
      <div className="mt-12">
        <Link href="/blogs" className="text-[#B48B7F]">
          ← Back to blogs
        </Link>
      </div>
    </main>
  );
}
