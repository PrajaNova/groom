import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAnalytics from "##/components/GoogleAnalytics";
import ConditionalLayout from "##/components/ConditionalLayout";
import { WhatsAppButton } from "##/components/common/WhatsAppButton";
import Modal from "##/components/Modal";
import { AuthProvider } from "##/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";
import "./ui.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Groom - Mental Health Support",
  description: "A safe space for mental health support and confessions",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics GA_MEASUREMENT_ID="G-810Y1J3FJG" />
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Modal />
        </AuthProvider>
        <WhatsAppButton />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}
