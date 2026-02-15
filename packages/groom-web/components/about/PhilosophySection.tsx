import type React from "react";
import Card from "../common/Card";

const PhilosophySection: React.FC = () => {
  return (
    <section className="mt-16">
      <h3 className="text-4xl font-bold text-[#2C3531] text-center mb-12">
        Our Philosophy
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center p-8 shadow-md">
          <span className="text-5xl text-[#B48B7F] mb-4 block">&#9733;</span>
          <h4 className="text-xl font-semibold mb-2 text-[#2C3531]">
            Absolute Confidentiality
          </h4>
          <p className="text-gray-600">
            Your privacy and trust are our highest priority. This is a
            non-judgmental, secure space for authentic sharing.
          </p>
        </Card>
        <Card className="text-center p-8 shadow-md">
          <span className="text-5xl text-[#B48B7F] mb-4 block">&#9734;</span>
          <h4 className="text-xl font-semibold mb-2 text-[#2C3531]">
            Mindful Presence
          </h4>
          <p className="text-gray-600">
            We offer focused, distraction-free attention in every session,
            ensuring you are truly seen and heard.
          </p>
        </Card>
        <Card className="text-center p-8 shadow-md">
          <span className="text-5xl text-[#B48B7F] mb-4 block">&#9733;</span>
          <h4 className="text-xl font-semibold mb-2 text-[#2C3531]">
            Practical Integration
          </h4>
          <p className="text-gray-600">
            We provide actionable tools you can use immediately to manage stress
            and build emotional resilience in daily life.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default PhilosophySection;
