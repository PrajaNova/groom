import Link from "next/link";
import type React from "react";

type BlogProps = {
  id?: string;
  title: string;
  slug: string;
  category?: string | null;
  readTime?: number | null;
  excerpt?: string | null;
  imageSeed?: string;
};

import AppImage from "../AppImage";
import Card from "../common/Card";

const BlogCard: React.FC<BlogProps> = ({
  title,
  slug,
  category,
  readTime,
  excerpt,
  imageSeed,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-100 h-full">
      <div className="w-full h-56 relative">
        <AppImage
          src={imageSeed ?? ""}
          width={600}
          height={400}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col h-64">
        <p className="text-sm text-[#B48B7F] font-semibold mb-1">
          {category} &bull; {readTime} min read
        </p>
        <h4 className="text-xl font-bold mb-2 text-[#2C3531] hover:text-[#B48B7F] transition duration-300">
          {title}
        </h4>
        <p className="text-gray-600 text-sm line-clamp-3 flex-1">{excerpt}</p>
        <div className="mt-4">
          <Link
            href={`/blogs/${slug}`}
            className="inline-block text-[#B48B7F] font-medium hover:text-[#2C3531] transition duration-300"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
