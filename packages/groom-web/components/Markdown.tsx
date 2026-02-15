import Link from "next/link";
import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import AppImage from "./AppImage";

type Props = {
  content: string;
  blogTitle?: string;
  className?: string;
};

const Markdown: FC<Props> = ({ content, blogTitle, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C3531] my-4">
              {props.children}
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <>
              <h2 className="text-2xl md:text-3xl font-bold my-3">
                {props.children}
              </h2>
              <hr className="border-t border-gray-200 my-6" />
            </>
          ),
          h3: ({ node, ...props }) => (
            <>
              <h3 className="text-xl md:text-2xl font-semibold my-2">
                {props.children}
              </h3>
              <hr className="border-t border-gray-100 my-4" />
            </>
          ),
          img: ({ node, ...props }) => {
            const raw = props.src as unknown;
            const src = (typeof raw === "string" ? raw : String(raw)) ?? "";
            const isAbsolute = /^https?:\/\//i.test(src);
            const imgSrc = isAbsolute
              ? src
              : src.startsWith("/")
                ? src
                : `/${src}`;
            const alt = (props.alt as string) ?? blogTitle ?? "";
            return (
              <AppImage
                src={imgSrc}
                alt={alt}
                width={800}
                height={450}
                className="w-full h-auto object-cover rounded"
              />
            );
          },
          hr: () => <hr className="border-t border-gray-200 my-6" />,
          a: ({ node, ...props }) => {
            const href = (props.href as string) ?? "#";
            const isExternal = /^https?:\/\//i.test(href);
            if (isExternal)
              return <a {...props} target="_blank" rel="noopener noreferrer" />;
            return <Link href={href as string}>{props.children}</Link>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
