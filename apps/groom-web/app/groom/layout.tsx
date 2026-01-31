import type { Metadata } from "next";
import { WhatsAppButton } from "##/components/common/WhatsAppButton";
import Footer from "##/components/Footer";
import Header from "##/components/Header";

export const metadata: Metadata = {
  title: "Groom - Mental Health Support",
  description: "A safe space for mental health support and confessions",
  icons: {
    icon: "/logo.png",
  },
};

export default function GroomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
