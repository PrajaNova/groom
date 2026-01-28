import type React from "react";
import AppImage from "../AppImage";

const HeartCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7 text-[#8C2D3A]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <title>Close</title>
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

const StruggleCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="backdrop-blur-sm p-5 rounded-xl shadow-md flex items-center space-x-4 border">
    <div className="flex-shrink-0">
      <HeartCheckIcon />
    </div>
    <p className="text-[#1E3A2B] font-semibold text-lg">{children}</p>
  </div>
);

const SignsOfStruggles: React.FC = () => {
  return (
    <section id="signs" className="bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 uppercase tracking-wide">
          Signs of Mental Health Struggles
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="font-script text-base italic  text-[#8C2D3A] text-center mb-6">
              It's okay to not be okay—but it's also okay to seek help.
            </p>
            <StruggleCard>
              Feeling overwhelmed, anxious, or sad for long periods
            </StruggleCard>
            <StruggleCard>
              Trouble sleeping or losing interest in things you love
            </StruggleCard>
            <StruggleCard>
              Feeling isolated or struggling with daily tasks
            </StruggleCard>
          </div>

          <div className="relative h-[400px]">
            <AppImage
              src="/images/struggles.webp"
              alt="Signs of Mental Health Struggles"
              className="w-full h-full object-contain"
              width={2000}
              height={2666}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignsOfStruggles;
