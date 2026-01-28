import type React from "react";
import AppImage from "../AppImage";

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
  const data = [
    {
      myth: "Mental health issues are rare.",
      fact: "1 in 4 people experience mental health challenges.",
    },
    {
      myth: "Just be positive, and you'll be fine.",
      fact: "Mental health struggles need care, not just positive vibes.",
    },
    {
      myth: "Therapy is only for serious problems.",
      fact: "Therapy is for everyone—it's like a gym for your mind!",
    },
  ];

  return (
    <section id="myths" className=" py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-wide">
          Common Myths & Facts
        </h2>
        <i className="font-script text-2xl md:text-base text-[#8C2D3A] ">
          The truth about mental health is simple: it matters, and so do you.
        </i>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16">
          <div className="text-left space-y-8">
            {data.map((item) => (
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
