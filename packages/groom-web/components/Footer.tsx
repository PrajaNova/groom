import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-charcoal/90 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p>&copy; 2024 Groom.</p>
        <div className="flex flex-col space-y-2 mb-4 md:mb-0">
          <p className="font-semibold text-gray-700">Contact Us</p>
          <a
            href="tel:+919953731408"
            className="hover:text-black transition duration-300 text-sm"
          >
            +91 99537 31408
          </a>
          <a
            href="mailto:mentalhealth@groom.global"
            className="hover:text-black transition duration-300 text-sm"
          >
            mentalhealth@groom.global
          </a>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="#privacy"
            className="hover:text-black transition duration-300 text-sm"
          >
            Privacy
          </a>

          <a
            href="#terms"
            className="hover:text-black transition duration-300 text-sm"
          >
            Terms
          </a>
          <a
            href="https://www.prajanova.com"
            className="hover:text-black transition duration-300 text-sm"
          >
            Powered by @prajanova
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
