import type React from "react";
import AppImage from "../AppImage";

const Founder: React.FC = () => {
  return (
    <section id="founder" className="bg-[#D0D6C9] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Founder Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#006442] to-[#8C2D3A] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                <AppImage
                  src="/images/founder.jpg"
                  alt="Satwikk Arora, Founder"
                  className="rounded-lg shadow-lg w-full object-cover aspect-[4/5]"
                  width={400}
                  height={500}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#006442] mb-1">
              Meet the Founder
            </h3>
            <h4 className="text-4xl font-extrabold mb-4">SATWIKK ARORA</h4>
            <p className="mb-6 text-lg leading-relaxed">
              The author is a distinguished professional with a unique blend of
              expertise in finance, numerology, and mental health counselling.
              Holding an MBA from the prestigious Great Lakes Institute of
              Management, Chennai, he has built a successful career as a
              Corporate Banker, where he navigates the dynamic world of finance
              with precision and strategic insight. Beyond his corporate
              endeavors, the author is a certified Numerologist, trained at one
              of the most esteemed institutes of Occult Sciences. In addition to
              that, he is a certified Relationship and Marriage Counsellor. This
              specialized knowledge enables him to delve into the intricate
              connections between numbers, human behavior, and life’s patterns.
              Driven by a passion for making a meaningful difference, the author
              has cultivated a keen interest in Mental Health, Life coaching,
              Relationship counseling and Numerology. His empathetic approach
              and nuanced understanding of human emotions make him an insightful
              guide for those navigating the complexities of modern
              relationships and self-discovery.
            </p>
            <p className="mb-6 text-lg leading-relaxed">
              With a background in understanding an individual's journey and
              identifying deep routed issues, Satwikk established "Groom" to
              move beyond generic advice. He focuses on creating deeply
              personalized plans that respect the unique pace and context of
              every client.
            </p>
            <blockquote className="border-l-4 border-[#8C2D3A] pl-6 text-xl text-[#1E3A2B]">
              "My belief is that you already possess the wisdom you need. My
              role is simply to help you meet yourself."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
