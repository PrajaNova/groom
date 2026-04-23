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
import ServicesSection from "../components/home/ServicesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import { fetchServer } from "../services/serverApi";

interface Service {
  id: string;
  title: string;
  description: string;
  iconType: string;
  colorType: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  createdAt: string;
}

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  readTime: number | null;
  imageSeed: string;
  category: string | null;
  format: string;
  author: string | null;
  publishedAt: string;
}

interface Confession {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQData {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [
    services,
    testimonials,
    blogs,
    confessions,
    faqs,
  ] = await Promise.all([
    fetchServer<Service[]>("/api/services").catch(() => []),
    fetchServer<Testimonial[]>("/api/testimonials").catch(() => []),
    fetchServer<Blog[]>("/api/blogs").catch(() => []),
    fetchServer<Confession[]>("/api/confessions").catch(() => []),
    fetchServer<FAQData[]>("/api/faqs").catch(() => []),
  ]);

  return (
    <>
      <HeroSection />
      <WhatIsMentalHealth />
      <WhyItsImportant />
      <ServicesSection services={services} />
      <SignsOfStruggles />
      <MythsAndFacts />
      <ProcessSection />
      <TestimonialsSection testimonials={testimonials} />
      <BlogsPreviewSection blogs={blogs} />
      <ConfessionsPreviewSection confessions={confessions} />
      <AboutKaagaz />
      <FAQ faqs={faqs} />
      <FinalCTASection />
    </>
  );
}
