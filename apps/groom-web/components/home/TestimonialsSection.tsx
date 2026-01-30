import type React from "react";
import Card from "../common/Card";
import ScrollAnimation from "../common/ScrollAnimation";

const testimonials = [
  {
    quote:
      "The clarity I found in just three sessions was transformative. It felt like talking to a deeply intuitive friend who is also a professional expert.",
    author: "Anya S.",
  },
  {
    quote:
      "This space is truly quiet and non-judgemental. It helped me process complex feelings without the pressure of having to perform.",
    author: "David P.",
  },
  {
    quote:
      "I highly recommend the 1:1 sessions. The practical tools given were easy to apply to my everyday stress. A real anchor.",
    author: "Emi J.",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h3 className="text-4xl font-bold text-center text-[#2C3531] mb-16">
            What Clients Say
          </h3>
        </ScrollAnimation>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation
              key={`${testimonial.author.replace(/\s+/g, "-")}-${index}`}
              delay={index * 150}
            >
              <Card className="p-8 border-t-4 border-[#B48B7F] h-full">
                <p className="text-3xl text-[#B48B7F] mb-4">“</p>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
                <p className="mt-4 font-semibold text-[#2C3531]">
                  — {testimonial.author}
                </p>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
