import AppImage from "../AppImage";
import BookingButton from "../BookingButton";

const FounderSection: React.FC = () => {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center bg-white p-10 rounded-2xl shadow-xl border-t-4 border-[#B48B7F] mb-20">
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#006442] to-[#8C2D3A] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white p-4 rounded-lg shadow-2xl">
            <AppImage
              height={400}
              width={300}
              src="/images/founder.jpg"
              alt="Satwikk Arora, Founder"
              className="rounded-lg shadow-lg object-cover aspect-[3/4]"
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#006442] mb-1">
            Meet the Founder
          </h3>
          <h4 className="text-4xl font-bold text-[#2C3531]">SATWIKK ARORA</h4>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          The author is a distinguished professional with a unique blend of
          expertise in finance, numerology, and mental health counselling.
          Holding an MBA from the prestigious Great Lakes Institute of
          Management, Chennai, he has built a successful career as a Corporate
          Banker, where he navigates the dynamic world of finance with precision
          and strategic insight. Beyond his corporate endeavors, the author is a
          certified Numerologist, trained at one of the most esteemed institutes
          of Occult Sciences. In addition to that, he is a certified
          Relationship and Marriage Counsellor. This specialized knowledge
          enables him to delve into the intricate connections between numbers,
          human behavior, and life’s patterns. Driven by a passion for making a
          meaningful difference, the author has cultivated a keen interest in
          Mental Health, Life coaching, Relationship counseling and Numerology.
          His empathetic approach and nuanced understanding of human emotions
          make him an insightful guide for those navigating the complexities of
          modern relationships and self-discovery.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          With a background in understanding an individual's journey and
          identifying deep routed issues, Satwikk established "Groom" to move
          beyond generic advice. He focuses on creating deeply personalized
          plans that respect the unique pace and context of every client.
        </p>
        <blockquote className="text-lg text-gray-700 italic border-l-4 border-[#8C2D3A] pl-6">
          "My belief is that you already possess the wisdom you need. My role is
          simply to help you meet yourself."
        </blockquote>
        <BookingButton className="bg-[#2C3531] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B48B7F]">
          Connect with Satwikk
        </BookingButton>
      </div>
    </section>
  );
};

export default FounderSection;
