import type React from "react";
import Card from "../common/Card";
import ScrollAnimation from "../common/ScrollAnimation";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

const TestimonialsSection: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
  // Fallback to hardcoded testimonials if none are provided by the backend
  const displayedTestimonials = testimonials.length > 0 
    ? testimonials.slice(0, 3) 
    : [
        {
          id: "fallback-1",
          quote: "The clarity I found in just three sessions was transformative. It felt like talking to a deeply intuitive friend who is also a professional expert.",
          author: "Anya S.",
          createdAt: new Date().toISOString(),
        },
        {
          id: "fallback-2",
          quote: "This space is truly quiet and non-judgemental. It helped me process complex feelings without the pressure of having to perform.",
          author: "David P.",
          createdAt: new Date().toISOString(),
        },
        {
          id: "fallback-3",
          quote: "I highly recommend the 1:1 sessions. The practical tools given were easy to apply to my everyday stress. A real anchor.",
          author: "Emi J.",
          createdAt: new Date().toISOString(),
        },
      ];

  return (
    <section id="reviews" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h3 className="text-4xl font-bold text-center text-[#2C3531] mb-16">
            What Clients Say
          </h3>
        </ScrollAnimation>
        <div className="grid md:grid-cols-3 gap-8">
          {displayedTestimonials.map((testimonial, index) => (
            <ScrollAnimation
              key={testimonial.id}
              delay={index * 150}
            >
              <Card className="p-8 border-t-4 border-[#B48B7F] h-full">
                <p className="text-3xl text-[#B48B7F] mb-4">"</p>
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
