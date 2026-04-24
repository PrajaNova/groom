import type React from "react";
import BookingButton from "../BookingButton";
import { SERVICE_ICON_MAP, SERVICE_COLOR_MAP } from "./maps";

interface Service {
  id: string;
  title: string;
  description: string;
  iconType: string;
  colorType: string;
  order: number;
}

const ServicesSection: React.FC<{ services: Service[] }> = async ({ services }) => {
  if (!services || services.length === 0) return null;

  // Sort services by order field, default to 0 if not set
  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="services" className="py-24 bg-[#F0F2EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-[#B48B7F] uppercase tracking-widest mb-3">
            Our Expertise
          </h2>
          <p className="text-4xl font-extrabold text-[#2C3531] mb-4">
            Tailored Solutions for Your Journey
          </p>
          <div className="h-1 w-20 bg-[#B48B7F] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedServices.map((service) => {
            const icon = SERVICE_ICON_MAP[service.iconType as keyof typeof SERVICE_ICON_MAP] || null;
            const color = SERVICE_COLOR_MAP[service.colorType as keyof typeof SERVICE_COLOR_MAP] || "bg-gray-50 text-gray-600";
            
            return (
              <div
                key={service.id}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div
                  className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-[#2C3531] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {service.description}
                </p>
                <BookingButton className="text-[#B48B7F] font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Book Now
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    role="img"
                    aria-labelledby="book-now-arrow"
                  >
                    <title id="book-now-arrow">Book Now</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </BookingButton>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-[#2C3531] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <h3 className="text-3xl font-bold mb-2">
              Not sure which service is right for you?
            </h3>
            <p className="text-gray-300">
              Start with a free 15-minute discovery call to find your path.
            </p>
          </div>
          <BookingButton className="whitespace-nowrap bg-[#B48B7F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#a67a6d] transition-colors shadow-2xl shadow-black/20">
            Book Discovery Call
          </BookingButton>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
