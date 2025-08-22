"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-100 text-gray-800 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/forum" className="font-bold text-2xl hover:text-gray-600 transition-colors duration-200">
              WhisPr
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link 
                href="/forum" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
              >
                Forum
              </Link>
              {user && (
                <Link 
                  href="/my-messages" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                >
                  My Messages
                </Link>
              )}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold bg-gray-200/70 px-3 py-1 rounded-full text-gray-700">
                    {user.name}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg 
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg 
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/forum" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Forum
            </Link>
            {user && (
              <Link 
                href="/my-messages" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Messages
              </Link>
            )}
          </div>
          
          {/* Mobile User Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-2 space-y-3">
                <div className="flex items-center px-3">
                  <span className="text-base font-semibold bg-gray-200/70 px-3 py-1 rounded-full text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link 
                  href="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 