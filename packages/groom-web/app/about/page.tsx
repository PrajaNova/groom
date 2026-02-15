import BookSellSection from "##/components/about/BookSellSection";
import FounderSection from "##/components/about/FounderSection";
import MissionSection from "##/components/about/MissionSection";
import PhilosophySection from "##/components/about/PhilosophySection";
import ScrollAnimation from "##/components/common/ScrollAnimation";

const About: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <ScrollAnimation>
        <MissionSection />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <FounderSection />
      </ScrollAnimation>
      <ScrollAnimation delay={300}>
        <BookSellSection />
      </ScrollAnimation>
      <ScrollAnimation delay={400}>
        <PhilosophySection />
      </ScrollAnimation>
    </main>
  );
};

export default About;
