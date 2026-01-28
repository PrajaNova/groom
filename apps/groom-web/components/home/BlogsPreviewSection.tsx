import Link from "next/link";
import type React from "react";
import AppImage from "../AppImage";
import Card from "../common/Card";
import ScrollAnimation from "../common/ScrollAnimation";

const blogPreviews = [
  {
    imageSeed: "mindful",
    category: "Mindfulness",
    title: "5 Simple Ways to Start Your Day Mindfully",
    excerpt:
      "A brief guide to integrating quick, effective mindfulness practices into your morning routine for a centered day...",
  },
  {
    imageSeed: "stress",
    category: "Stress Management",
    title: "Understanding and Halting the Stress Cycle",
    excerpt:
      "We break down the physical and emotional loop of stress and offer three practical interrupt techniques...",
  },
  {
    imageSeed: "selfcare",
    category: "Self-Care",
    title: "The Power of Boundaries in Digital Age Self-Care",
    excerpt:
      "Setting limits is a crucial act of self-love. Learn how to establish healthy digital and emotional boundaries...",
  },
];

const BlogsPreviewSection: React.FC = () => {
  return (
    <section
      id="blogs-section"
      className="py-24 bg-white/70 border-t border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h3 className="text-4xl font-bold text-center text-[#2C3531] mb-16">
            Insight & Guidance
          </h3>
        </ScrollAnimation>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPreviews.map((blog, index) => (
            <ScrollAnimation key={blog.imageSeed} delay={index * 150}>
              <Card className="overflow-hidden hover:shadow-2xl transition duration-300 h-full">
                <AppImage
                  src={`https://picsum.photos/seed/${blog.imageSeed}/600/400`}
                  alt={blog.category}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-sm text-[#B48B7F] font-semibold mb-1">
                    {blog.category}
                  </p>
                  <h4 className="text-xl font-semibold mb-2 text-[#2C3531]">
                    {blog.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <Link
                    href="/blogs"
                    className="inline-block mt-3 text-[#B48B7F] font-medium hover:text-[#2C3531] transition duration-300"
                  >
                    Read More →
                  </Link>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
        <div className="text-center mt-12">
          <ScrollAnimation delay={300}>
            <Link
              href="/blogs"
              className="inline-block text-lg font-semibold text-[#2C3531] border-b-2 border-[#B48B7F] pb-1 hover:border-[#2C3531] transition duration-300"
            >
              View All Articles
            </Link>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default BlogsPreviewSection;
