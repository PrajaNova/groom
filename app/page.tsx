import AboutKaagaz from "##/components/home/AboutKaagaz";
import FAQ from "##/components/home/FAQ";
import MythsAndFacts from "##/components/home/MythsAndFacts";
import SignsOfStruggles from "##/components/home/SignsOfStruggles";
import WhatIsMentalHealth from "##/components/home/WhatIsMentalHealth";
import WhyItsImportant from "##/components/home/WhyItsImportant";
import BlogsPreviewSection from "../components/home/BlogsPreviewSection";
import ConfessionsPreviewSection from "../components/home/ConfessionsPreviewSection";
import FinalCTASection from "../components/home/FinalCTASection";
import HeroSection from "../components/home/HeroSection";
import ProcessSection from "../components/home/ProcessSection";
import TestimonialsSection from "../components/home/TestimonialsSection";

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
