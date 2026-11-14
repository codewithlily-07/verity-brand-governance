import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Transparent Glass to Dark Navy Navigation Bar
 * - Transparent glass initially, transforms to deep midnight navy with hairline gold border on scroll
 * - Left: Calligraphic Gold V Mark + "VERITY" (Cinzel) + "BRAND GOVERNANCE"
 * - Centre: Product, How It Works, Trust & Security, Resources
 * - Right: Explore Demo (ghost with gold outline) + Sign In (solid gold gradient)
 */
export function PublicNavbar({ setActivePage, onReplayIntro }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#071230]/95 backdrop-blur-xl border-b border-[#E8B84B]/30 shadow-[0_10px_30px_rgba(4,10,28,0.8)]'
          : 'py-5 bg-[#071230]/40 backdrop-blur-md border-b border-[#E8B84B]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* LEFT: Calligraphic Gold V Mark + Wordmark */}
          <div 
            onClick={() => {
              if (onReplayIntro) onReplayIntro();
              else setActivePage('landing');
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Click to replay opening intro"
          >
            {/* Calligraphic Gold V SVG */}
            <div className="relative w-9 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(232,184,75,0.7)]" fill="none">
                <defs>
                  <linearGradient id="navV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A5A12"/>
                    <stop offset="35%" stopColor="#E8B84B"/>
                    <stop offset="60%" stopColor="#FFF1B8"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="navV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3CC6B"/>
                    <stop offset="100%" stopColor="#FFF6D0"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#navV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#FFF1B8" opacity=".6"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#navV2)"/>
                <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
              </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1B8] via-[#E8B84B] to-[#FFF1B8] leading-none">
                VERITY
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-medium tracking-[0.45em] text-[#E8B84B]/80 uppercase mt-0.5 leading-none">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          {/* CENTRE: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300 whitespace-nowrap">
            <button
              type="button"
              onClick={() => scrollToSection('product')}
              className="relative py-1 hover:text-white transition-colors group"
            >
              <span>Product</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E8B84B] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="relative py-1 hover:text-white transition-colors group"
            >
              <span>How It Works</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E8B84B] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('trust-security')}
              className="relative py-1 hover:text-white transition-colors group"
            >
              <span>Trust & Security</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E8B84B] transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('resources')}
              className="relative py-1 hover:text-white transition-colors group"
            >
              <span>Resources</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E8B84B] transition-all duration-200 group-hover:w-full" />
            </button>
          </nav>

          {/* RIGHT: Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Explore Demo (Ghost with gold outline) */}
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#E8B84B]/10 text-[#FFF1B8] font-semibold border border-[#E8B84B]/50 transition-all active:scale-95 text-xs tracking-wide"
            >
              Explore Demo
            </button>

            {/* Sign In (Solid gold gradient, dark text) */}
            <button
              type="button"
              onClick={() => setActivePage('login')}
              className="btn-gold-sweep px-5 py-2 rounded-xl bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold shadow-glow transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#071230]" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#FFF1B8] hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-In Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071230]/98 border-b border-[#E8B84B]/30 px-5 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => scrollToSection('product')}
            className="block w-full text-left py-2 text-sm text-gray-200 hover:text-[#FFF1B8]"
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm text-gray-200 hover:text-[#FFF1B8]"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('trust-security')}
            className="block w-full text-left py-2 text-sm text-gray-200 hover:text-[#FFF1B8]"
          >
            Trust & Security
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('resources')}
            className="block w-full text-left py-2 text-sm text-gray-200 hover:text-[#FFF1B8]"
          >
            Resources
          </button>

          <div className="pt-3 border-t border-gray-800 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('dashboard');
              }}
              className="w-full py-2.5 rounded-xl border border-[#E8B84B]/50 text-[#FFF1B8] font-semibold text-center text-xs"
            >
              Explore Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('login');
              }}
              className="btn-gold-sweep w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E8B84B] to-[#FFF1B8] text-[#071230] font-bold text-center text-xs shadow-glow flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
