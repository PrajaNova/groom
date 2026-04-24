import type React from "react";
import AppImage from "../AppImage";
import { mythsAndFactsContent } from "##/content/home/myths-and-facts";

interface MythFactCardProps {
  myth: string;
  fact: string;
}

const MythFactCard: React.FC<MythFactCardProps> = ({ myth, fact }) => (
  <div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg shadow-lg border border-white">
    <p className="text-lg">
      <span className="font-bold text-[#8C2D3A] mr-2">Myth:</span>
      {myth}
    </p>
    <hr className="my-3 border-gray-300" />
    <p className="text-lg">
      <span className="font-bold text-[#006442] mr-2">Fact:</span>
      {fact}
    </p>
  </div>
);

const MythsAndFacts: React.FC = () => {
  return (
    <section id="myths" className=" py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-wide">
          {mythsAndFactsContent.title}
        </h2>
        <i className="font-script text-2xl md:text-base text-[#8C2D3A] ">
          {mythsAndFactsContent.quote}
        </i>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16">
          <div className="text-left space-y-8">
            {mythsAndFactsContent.data.map((item) => (
              <MythFactCard key={item.myth} myth={item.myth} fact={item.fact} />
            ))}
          </div>
          <div className="relative ">
            <AppImage
              src="/images/myths.png"
              alt="Common Myths & Facts"
              width={2000}
              height={2666}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MythsAndFacts;
