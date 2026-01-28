"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import AppImage from "../AppImage";

const AboutKaagaz: React.FC = () => {
  const router = useRouter();

  const handleBuyBookClick = () => {
    router.push("/about");
  };

  return (
    <section className="bg-[#F0F2EF] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#006442] mb-1">
              About Kaagaz
            </h3>
            <h4 className="text-4xl font-extrabold mb-4">
              WRITTEN BY SATWIKK ARORA
            </h4>
            <p className="text-lg leading-relaxed mb-8">
              This book offers a profound exploration of the complexities of
              heartbreak, delving deep into the emotional and psychological
              stages one experiences during such a turbulent time. The journey
              begins with the rawness of heartbreak, addressing the shock,
              denial, and grief that follow. It progresses through the
              recognition of mental health challenges that often accompany this
              period, such as anxiety, depression, and feelings of isolation.
              The book also sheds light on the dynamics and transactions within
              relationships—both the emotional investments and the
              often-overlooked imbalances that can shape the bond. Ultimately,
              the book serves as a gentle guide for readers to rediscover their
              strength, rebuild their identity, and embrace the possibility of
              growth and renewal after heartbreak. It is a heartfelt companion
              for anyone seeking solace, understanding, and hope during their
              healing journey.
            </p>
            <button
              type="button"
              className="btn-pill"
              onClick={handleBuyBookClick}
            >
              Buy Kaagaz Now
            </button>
          </div>
          <div className="md:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#006442] to-[#8C2D3A] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                <AppImage
                  src="/images/book_cover.png"
                  alt="Book cover of Kaagaz"
                  className="rounded-lg shadow-lg w-full object-cover aspect-[4/5]"
                  width={400}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutKaagaz;
