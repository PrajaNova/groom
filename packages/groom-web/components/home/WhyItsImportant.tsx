import type React from "react";
import AppImage from "../AppImage";
import { whyImportantContent } from "##/content/home/why-important";

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <svg
      className="w-6 h-6 text-[#006442] mr-3 flex-shrink-0 mt-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
    <span className="text-lg">{children}</span>
  </li>
);

const WhyItsImportant: React.FC = () => {
  return (
    <section id="importance" className=" py-24 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="h-[400px] relative">
          <AppImage
            src="/images/whyimp.webp"
            alt="Why It's Important"
            className="w-full h-full object-contain"
            width={2000}
            height={2666}
          />
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 uppercase tracking-wide">
            {whyImportantContent.title}
          </h2>
          <ul className="space-y-4">
            {whyImportantContent.points.map((point, index) => (
              <ListItem key={index}>{point}</ListItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyItsImportant;
