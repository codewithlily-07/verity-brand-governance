import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Sparkles, ChevronDown } from 'lucide-react';

/**
 * Public Landing Page Gold Navigation Bar
 * Background: #C6A15B (Gold)
 * Text: #101B35 (Deep Navy)
 * Sticky, responsive, with smooth scroll compression.
 */
export function PublicNavbar({ setActivePage, onOpenLogin, onOpenDemo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 shadow-lg bg-[#C6A15B]'
          : 'py-4 shadow-sm bg-[#C6A15B]'
      }`}
      style={{ backgroundColor: '#C6A15B', color: '#101B35' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* LEFT: VERITY Shield Logo & Wordmark */}
          <div 
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Custom SVG Shield/Check Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#101B35] text-[#C6A15B] shadow-md transition-transform group-hover:scale-105">
              <svg 
                viewBox="0 0 40 40" 
                className="w-6 h-6" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M20 4 L34 9 V20 C34 29 20 36 20 36 C20 36 6 29 6 20 V9 L20 4 Z" 
                  fill="#101B35" 
                  stroke="#C6A15B" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M13 20 L18 25 L28 15" 
                  stroke="#C6A15B" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#101B35] leading-none">
                VERITY
              </span>
              <span className="text-[9px] font-mono font-semibold tracking-[0.2em] text-[#101B35]/80 uppercase mt-0.5 leading-none">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          {/* RIGHT: Public Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#101B35] whitespace-nowrap">
            <button
              type="button"
              onClick={() => scrollToSection('product')}
              className="relative py-1 hover:text-[#0B1428] transition-colors group"
            >
              <span>Product</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#101B35] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="relative py-1 hover:text-[#0B1428] transition-colors group"
            >
              <span>How It Works</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#101B35] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('trust-security')}
              className="relative py-1 hover:text-[#0B1428] transition-colors group"
            >
              <span>Trust & Security</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#101B35] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('resources')}
              className="relative py-1 hover:text-[#0B1428] transition-colors group"
            >
              <span>Resources</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#101B35] transition-all duration-200 group-hover:w-full" />
            </button>

            {/* Explore Demo CTA */}
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className="px-4 py-2 rounded-lg bg-[#101B35]/10 hover:bg-[#101B35]/20 text-[#101B35] font-semibold border border-[#101B35]/30 transition-all active:scale-95"
            >
              Explore Demo
            </button>

            {/* Sign In CTA */}
            <button
              type="button"
              onClick={() => setActivePage('login')}
              className="px-5 py-2 rounded-lg bg-[#101B35] hover:bg-[#0B1428] text-white font-semibold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#101B35] hover:bg-[#101B35]/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#101B35]/20 bg-[#C6A15B] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => scrollToSection('product')}
            className="block w-full text-left py-2 px-3 rounded-md text-[#101B35] font-semibold hover:bg-[#101B35]/10"
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 px-3 rounded-md text-[#101B35] font-semibold hover:bg-[#101B35]/10"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('trust-security')}
            className="block w-full text-left py-2 px-3 rounded-md text-[#101B35] font-semibold hover:bg-[#101B35]/10"
          >
            Trust & Security
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('resources')}
            className="block w-full text-left py-2 px-3 rounded-md text-[#101B35] font-semibold hover:bg-[#101B35]/10"
          >
            Resources
          </button>

          <div className="pt-3 border-t border-[#101B35]/20 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('dashboard');
              }}
              className="w-full py-2.5 rounded-lg bg-[#101B35]/10 text-[#101B35] font-semibold text-center border border-[#101B35]/30"
            >
              Explore Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('login');
              }}
              className="w-full py-2.5 rounded-lg bg-[#101B35] text-white font-semibold text-center shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

