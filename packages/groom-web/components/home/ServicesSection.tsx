"use client";
import Image from "next/image";
import type React from "react";
import BookingButton from "../BookingButton";

const services = [
  {
    title: "Self Help",
    description:
      "Empower yourself with proven techniques to navigate daily challenges, build resilience, and unlock your true potential through guided self-mastery.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Couple Therapy",
    description:
      "Rebuild connection and understanding. We provide a safe space to resolve conflicts, improve communication, and strengthen the bond between partners.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Career Consultation",
    description:
      "Align your professional path with your core values. Strategic guidance to overcome career plateaus and achieve meaningful professional growth.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Numerology",
    description:
      "Unlock the hidden patterns of your life. Discover how numbers influence your destiny and use these insights to make better life decisions.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
    ),
    color: "bg-purple-50 text-purple-600",
  },
];

const ServicesSection: React.FC = () => {
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
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div
                className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </BookingButton>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-[#2C3531] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="text-white text-center md:text-left">
            <h3 className="text-3xl font-bold mb-2">
              Not sure which service is right for you?
            </h3>
            <p className="text-gray-300">
              Start with a free 15-minute discovery call to find your path.
            </p>
          </div>
          <BookingButton className="whitespace-nowrap bg-[#B48B7F] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#a67a6d] transition-colors shadow-lg shadow-black/20">
            Book Discovery Call
          </BookingButton>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
