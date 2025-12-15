import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import BookingButton from "##/components/BookingButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLinks = () => (
    <>
      <Link
        href="/"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F] hover:bg-gray-50 transition duration-300 md:p-0 md:bg-transparent md:hover:bg-transparent"
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/about"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F] hover:bg-gray-50 transition duration-300 md:p-0 md:bg-transparent md:hover:bg-transparent"
        onClick={() => setIsMenuOpen(false)}
      >
        About Us
      </Link>
      <Link
        href="/blogs"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F] hover:bg-gray-50 transition duration-300 md:p-0 md:bg-transparent md:hover:bg-transparent"
        onClick={() => setIsMenuOpen(false)}
      >
        Blogs
      </Link>
      <Link
        href="/confessions"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F] hover:bg-gray-50 transition duration-300 md:p-0 md:bg-transparent md:hover:bg-transparent"
        onClick={() => setIsMenuOpen(false)}
      >
        Confession
      </Link>
      <Link
        href="/bookings"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F] hover:bg-gray-50 transition duration-300 md:p-0 md:bg-transparent md:hover:bg-transparent"
        onClick={() => setIsMenuOpen(false)}
      >
        Bookings
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/" className=" justify-center  tracking-wider">
          <div className="flex items-center text-2xl font-bold text-[#006442]">
            <Image
              alt="groom logo"
              src="/images/logo.png"
              height={50}
              width={50}
            />
            Groom
          </div>
          <span className="text-[10px] uppercase  font-semibold  text-gray-500">
            Transform today, lead tomorrow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <NavLinks />
        </nav>

        <div className="hidden md:block">
          <BookingButton className="btn-sm" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <BookingButton className="btn-sm text-xs px-3 py-1" />
          <button
            type="button"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-[#006442] focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Close menu</title>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Open menu</title>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-2">
          <NavLinks />
        </div>
      )}
    </header>
  );
};

export default Header;
