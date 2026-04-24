import type React from "react";
import Card from "../common/Card";
import { philosophyContent } from "##/content/about/philosophy";

const PhilosophySection: React.FC = () => {
  return (
    <section className="mt-16">
      <h3 className="text-4xl font-bold text-[#2C3531] text-center mb-12">
        {philosophyContent.title}
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        {philosophyContent.items.map((item, index) => (
          <Card key={index} className="text-center p-8 shadow-md">
            <span className="text-5xl text-[#B48B7F] mb-4 block">{item.icon}</span>
            <h4 className="text-xl font-semibold mb-2 text-[#2C3531]">
              {item.title}
            </h4>
            <p className="text-gray-600">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PhilosophySection;
