import ScrollAnimation from "../common/ScrollAnimation";

const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      className="py-24 bg-white/70 border-t border-b border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <h3 className="text-4xl font-bold text-center text-[#2C3531] mb-16">
            The Simple Path to Well-being
          </h3>
        </ScrollAnimation>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <ScrollAnimation delay={0}>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-[#B48B7F] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                1
              </div>
              <h4 className="text-2xl font-semibold mb-2 text-[#2C3531]">
                Connect
              </h4>
              <p className="text-gray-600">
                Schedule your introductory session to discuss your needs and
                goals
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={200}>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-[#B48B7F] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                2
              </div>
              <h4 className="text-2xl font-semibold mb-2 text-[#2C3531]">
                Discover
              </h4>
              <p className="text-gray-600">
                Engage in personalized 1:1 session to uncover patterns and
                reason behind the underlying issue.
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={400}>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-[#B48B7F] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                3
              </div>
              <h4 className="text-2xl font-semibold mb-2 text-[#2C3531]">
                Flourish
              </h4>
              <p className="text-gray-600">
                Experience lasting, positive transformation post the session and
                give a chance to meet the real “you”.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
