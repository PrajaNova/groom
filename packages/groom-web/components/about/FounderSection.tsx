import AppImage from "../AppImage";
import BookingButton from "../BookingButton";
import { founderContent } from "##/content/about/founder";

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
              alt={`${founderContent.name}, Founder`}
              className="rounded-lg shadow-lg object-cover aspect-[3/4]"
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#006442] mb-1">
            {founderContent.sectionTitle}
          </h3>
          <h4 className="text-4xl font-bold text-[#2C3531]">{founderContent.name}</h4>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">
          {founderContent.bioParagraph1}
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          {founderContent.bioParagraph2}
        </p>
        <blockquote className="text-lg text-gray-700 italic border-l-4 border-[#8C2D3A] pl-6">
          "{founderContent.quote}"
        </blockquote>
        <BookingButton className="bg-[#2C3531] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B48B7F]">
          {founderContent.ctaText}
        </BookingButton>
      </div>
    </section>
  );
};

export default FounderSection;
