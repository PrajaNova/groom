import AboutKaagaz from "##/components/home/AboutKaagaz";
import BlogsPreviewSection from "##/components/home/BlogsPreviewSection";
import ConfessionsPreviewSection from "##/components/home/ConfessionsPreviewSection";
import FAQ from "##/components/home/FAQ";
import FinalCTASection from "##/components/home/FinalCTASection";
import HeroSection from "##/components/home/HeroSection";
import MythsAndFacts from "##/components/home/MythsAndFacts";
import ProcessSection from "##/components/home/ProcessSection";
import SignsOfStruggles from "##/components/home/SignsOfStruggles";
import TestimonialsSection from "##/components/home/TestimonialsSection";
import WhatIsMentalHealth from "##/components/home/WhatIsMentalHealth";
import WhyItsImportant from "##/components/home/WhyItsImportant";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <WhatIsMentalHealth />
      <WhyItsImportant />
      <SignsOfStruggles />
      <MythsAndFacts />
      <ProcessSection />
      <TestimonialsSection />
      <BlogsPreviewSection />
      <ConfessionsPreviewSection />
      <AboutKaagaz />
      <FAQ />
      <FinalCTASection />
    </>
  );
};

export default Home;
