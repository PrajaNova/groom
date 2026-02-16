"use client";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import AppImage from "../AppImage";
import BookingButton from "../BookingButton";

const HeroSection: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getAnimationClasses = (_delay: string) =>
    `transition-all duration-700 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`;

  return (
    <section id="home" className="relative overflow-hidden py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3 space-y-8">
          <p
            className={`flex items-center text-lg text-[#B48B7F] font-semibold uppercase tracking-widest ${getAnimationClasses(
              "delay-100",
            )}`}
          >
            <Image
              alt="groom logo"
              src="/images/logo.png"
              height={100}
              width={100}
            />
            Transform Today, Lead Tomorrow
          </p>
          <h2
            className={`text-5xl md:text-6xl font-extrabold text-[#2C3531] leading-tight ${getAnimationClasses(
              "delay-200",
            )}`}
            style={{ transitionDelay: "200ms" }}
          >
            Find your solitude and&nbsp;
            <span className="text-[#B48B7F]">Meet Yourself</span>
            &nbsp;in the crowd
          </h2>
          <p
            className={`text-xl text-gray-700 max-w-lg ${getAnimationClasses(
              "delay-300",
            )}`}
            style={{ transitionDelay: "350ms" }}
          >
            We provide personalized, private 1:1 sessions focusing on your
            personal journey and identifying deep wounds/ issues for resolution.
          </p>
          <div
            className={getAnimationClasses("delay-500")}
            style={{ transitionDelay: "500ms" }}
          >
            <BookingButton className="btn-primary">
              Book Your Discovery Call
            </BookingButton>
          </div>
        </div>
        <div className="md:col-span-2 hidden md:block">
          <div
            className={`w-full h-[450px] bg-[#2C3531] rounded-3xl shadow-2xl overflow-hidden transition-opacity duration-1000 ${
              isMounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <AppImage
              src="https://picsum.photos/seed/calm/2400/3600"
              alt="Calming natural scene"
              height={2400}
              width={3600}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
