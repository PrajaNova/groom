import type React from "react";
import BookingButton from "../BookingButton";
import ScrollAnimation from "../common/ScrollAnimation";

const FinalCTASection: React.FC = () => {
  return (
    <section id="booking-cta" className="py-20 bg-[#2C3531]">
      <ScrollAnimation>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-extrabold text-white mb-4">
            Ready to Start Your Work?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Schedule your confidential, non-judgmental 1:1 session today.
          </p>
          <BookingButton className="inline-block bg-[#B48B7F] text-white font-extrabold text-2xl py-4 px-12 rounded-lg shadow-2xl transition duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" />
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default FinalCTASection;
