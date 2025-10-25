'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation({ currentPage = 'home', activeSection = '' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Mobile navigation state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    if (currentPage === 'home') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-md shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-center h-16">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-black tracking-[0.2em] text-black">
                CORY WOODALL
              </div>
              <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
              <div className="text-black transition-all duration-300 opacity-70">About</div>
              <div className="text-black transition-all duration-300 opacity-70">Portfolio</div>
              <div className="text-black transition-all duration-300 opacity-70">Contact</div>
              <div className="text-black transition-all duration-300 opacity-70">FAQ</div>
              <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
              <div className="text-black transition-all duration-300 opacity-70">Articles</div>
            </div>
          </div>
          <div className="md:hidden flex items-center justify-between h-16">
            <div className="text-lg font-black tracking-[0.2em] text-black">CORY WOODALL</div>
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-md shadow-lg z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center h-16">
          <div className="flex items-center space-x-6">
            {currentPage === 'home' ? (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xl font-black hover:scale-105 transition-all duration-300 tracking-[0.2em] text-black"
              >
                CORY WOODALL
              </button>
            ) : (
              <Link 
                href="/" 
                className="text-xl font-black hover:scale-105 transition-all duration-300 tracking-[0.2em] text-black"
              >
                CORY WOODALL
              </Link>
            )}
            <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
            
            {currentPage === 'home' ? (
              <>
                <button 
                  onClick={() => scrollToSection('about')}
                  className={`text-black transition-all duration-300 ${
                    activeSection === 'about' 
                      ? 'opacity-100 scale-110 font-bold' 
                      : 'opacity-70 hover:scale-110 hover:opacity-100'
                  }`}
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className={`text-black transition-all duration-300 ${
                    activeSection === 'portfolio' 
                      ? 'opacity-100 scale-110 font-bold' 
                      : 'opacity-70 hover:scale-110 hover:opacity-100'
                  }`}
                >
                  Portfolio
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`text-black transition-all duration-300 ${
                    activeSection === 'contact' 
                      ? 'opacity-100 scale-110 font-bold' 
                      : 'opacity-70 hover:scale-110 hover:opacity-100'
                  }`}
                >
                  Contact
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className={`text-black transition-all duration-300 ${
                    activeSection === 'faq' 
                      ? 'opacity-100 scale-110 font-bold' 
                      : 'opacity-70 hover:scale-110 hover:opacity-100'
                  }`}
                >
                  FAQ
                </button>
              </>
            ) : (
              <>
                <Link href="/#about" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  About
                </Link>
                <Link href="/#portfolio" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  Portfolio
                </Link>
                <Link href="/#contact" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  Contact
                </Link>
                <Link href="/#faq" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  FAQ
                </Link>
              </>
            )}
            
            <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
            <Link 
              href="/articles" 
              className={`text-black transition-all duration-300 ${
                currentPage === 'articles' 
                  ? 'opacity-100 font-bold' 
                  : 'opacity-70 hover:scale-110 hover:opacity-100'
              }`}
            >
              Articles
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {currentPage === 'home' ? (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-lg font-black tracking-[0.2em] text-black"
              >
                CORY WOODALL
              </button>
            ) : (
              <Link href="/" className="text-lg font-black tracking-[0.2em] text-black">
                CORY WOODALL
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-black hover:bg-black/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-black/10">
            <div className="px-4 py-4 space-y-3">
              {currentPage === 'home' ? (
                <>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection('portfolio')}
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                  >
                    Portfolio
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => scrollToSection('faq')}
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                  >
                    FAQ
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/#about" 
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/#portfolio" 
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                  <Link 
                    href="/#contact" 
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link 
                    href="/#faq" 
                    className="block w-full text-left py-2 text-black hover:bg-black/10 rounded px-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </>
              )}
              
              <div className="border-t border-black/20 my-2"></div>
              
              <Link 
                href="/articles" 
                className={`block w-full text-left py-2 rounded px-2 transition-colors ${
                  currentPage === 'articles' 
                    ? 'text-black font-bold bg-black/10' 
                    : 'text-black hover:bg-black/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
