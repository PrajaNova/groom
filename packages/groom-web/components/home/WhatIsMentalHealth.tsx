import { Heart } from "lucide-react";
import AppImage from "../AppImage";
import { whatIsMHContent } from "##/content/home/what-is-mh";

function WhatIsMentalHealthSection() {
  return (
    <section className="py-20 px-6 from-sage-50 to-blue-50 bg-white/70">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 w-full flex flex-col">
          <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 text-center">
            {whatIsMHContent.title}
          </h2>
          <i className="font-script text-xs md:text-base text-center text-[#8C2D3A]">
            {whatIsMHContent.quote}
          </i>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {whatIsMHContent.points.map((point, index) => (
              <div
                key={index}
                className={`${
                  index === 3 ? "bg-sage-100" : "bg-white"
                } p-6 rounded-2xl shadow-md border`}
              >
                <div className="flex items-start gap-3">
                  {index === 1 && (
                    <Heart
                      className="text-rose-500 fill-rose-500 flex-shrink-0 mt-1"
                      size={24}
                    />
                  )}
                  <p className="text-slate-700 text-lg leading-relaxed">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-[500px] w-full">
            <AppImage
              src="/images/whatismh.webp"
              alt="What is Mental Health"
              className="w-full h-full object-contain"
              width={2000}
              height={2666}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default WhatIsMentalHealthSection;
