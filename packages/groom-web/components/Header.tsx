"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import BookingButton from "@/components/BookingButton";
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("SUPER_ADMIN");

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginClick = () => {
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

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
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/" className="justify-center tracking-wider">
          <div className="flex items-center text-2xl font-bold text-[#006442]">
            <Image
              alt="groom logo"
              src="/images/logo.png"
              height={50}
              width={50}
            />
            Groom
          </div>
          <span className="text-[10px] uppercase font-semibold text-gray-500">
            Transform today, lead tomorrow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <BookingButton className="btn-sm" />

          {/* User Profile / Login */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                } else {
                  handleLoginClick();
                }
              }}
              disabled={isLoading}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none overflow-hidden border border-gray-300 disabled:opacity-50"
            >
              {user ? (
                user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    {getInitials(user.name)}
                  </span>
                )
              ) : (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Profile</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </button>

            {/* Dropdown */}
            {user && isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (user) {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
              } else {
                handleLoginClick();
              }
            }}
            disabled={isLoading}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-300 disabled:opacity-50"
          >
            {user ? (
              user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <span className="text-xs font-semibold text-gray-700">
                  {getInitials(user.name)}
                </span>
              )
            ) : (
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Profile</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-[#006442] focus:outline-none"
            aria-label="Toggle menu"
          >
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
              <title>Toggle menu</title>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-2">
          <NavLinks />
          {user ? (
            <>
              <div className="border-t border-gray-100 my-2"></div>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/my-bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B48B7F]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleLoginClick();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#006442] hover:bg-gray-50"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
