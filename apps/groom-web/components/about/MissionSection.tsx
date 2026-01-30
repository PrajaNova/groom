import type React from "react";

const MissionSection: React.FC = () => {
  return (
    <section className="text-center mb-20">
      <h2 className="text-4xl md:text-6xl font-extrabold text-[#2C3531] mb-6">
        Our Mission: Grounded Care
      </h2>
      <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
        We believe true resilience comes not from force, but from quiet,
        compassionate, and personalized self-discovery. We are here to guide you
        back to your inner ground.
      </p>
      <div className="mt-8">
        <span className="inline-block text-[#B48B7F] text-xl font-bold border-b-2 border-[#B48B7F] pb-1">
          Grounded &bull; Gentle &bull; Growth
        </span>
      </div>
    </section>
  );
};

export default MissionSection;
