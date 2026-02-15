import Link from "next/link";
import type React from "react";
import Card from "../common/Card";
import ScrollAnimation from "../common/ScrollAnimation";

const ConfessionsPreviewSection: React.FC = () => {
  return (
    <section id="confession-section" className="py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h3 className="text-4xl font-bold text-center text-[#2C3531] mb-4">
            The Quiet Corner
          </h3>
          <p className="text-center text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            A selection of anonymous thoughts shared by our community—a reminder
            that you are never alone in your journey.
          </p>
        </ScrollAnimation>
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollAnimation delay={0}>
            <Card className="p-6 border-l-4 border-[#2C3531]/50 h-full">
              <p className="text-2xl text-[#2C3531]/30 mb-2 font-serif">“</p>
              <p className="text-gray-600 italic">
                "It’s okay to not be okay today. I needed to let someone know
                that, even if it’s just the digital air."
              </p>
              <p className="text-right text-sm text-gray-400 mt-3">
                — Anonymous
              </p>
            </Card>
          </ScrollAnimation>
          <ScrollAnimation delay={150}>
            <Card className="p-6 border-l-4 border-[#2C3531]/50 h-full">
              <p className="text-2xl text-[#2C3531]/30 mb-2 font-serif">“</p>
              <p className="text-gray-600 italic">
                "I finally said no to an extra obligation this week. Small win,
                but it feels huge. I am protecting my peace."
              </p>
              <p className="text-right text-sm text-gray-400 mt-3">
                — Anonymous
              </p>
            </Card>
          </ScrollAnimation>
        </div>
        <div className="text-center mt-12">
          <ScrollAnimation delay={300}>
            <Link
              href="/confession"
              className="inline-block text-lg font-semibold text-[#2C3531] border-b-2 border-[#B48B7F] pb-1 hover:border-[#2C3531] transition duration-300"
            >
              View & Share Confessions
            </Link>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ConfessionsPreviewSection;
