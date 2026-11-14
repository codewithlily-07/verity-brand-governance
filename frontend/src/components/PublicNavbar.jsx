import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Sticky Glass Public Navigation Bar
 * - Sticky, glass blur with thin gold bottom border on scroll
 * - Links in ivory, gold on hover with animated underline, active link is gold
 * - "Sign In" solid gold gradient button, "Explore Demo" gold outline button
 * - Mobile: hamburger with slide-in panel
 */
export function PublicNavbar({ activePage = 'landing', setActivePage, onReplayIntro }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'product', label: 'Product' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'trust-security', label: 'Trust & Security' },
    { id: 'resources', label: 'Resources' },
  ];

  const handleNavClick = (pageId) => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) {
      setActivePage(pageId);
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#0A1230]/95 backdrop-blur-xl border-b border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(6,11,31,0.85)]'
          : 'py-4 bg-[#0A1230]/75 backdrop-blur-md border-b border-[#D4AF37]/15'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* LEFT: Calligraphic Gold V Mark + Wordmark */}
          <div 
            onClick={() => {
              if (activePage === 'landing' && onReplayIntro) onReplayIntro();
              else handleNavClick('landing');
            }}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="VERITY Home"
          >
            {/* Calligraphic Gold V SVG */}
            <div className="relative w-9 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.7)]" fill="none">
                <defs>
                  <linearGradient id="navV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A5A12"/>
                    <stop offset="35%" stopColor="#D4AF37"/>
                    <stop offset="60%" stopColor="#F3D98B"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="navV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3CC6B"/>
                    <stop offset="100%" stopColor="#FFF6D0"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#navV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#F3D98B" opacity=".6"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#navV2)"/>
                <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
              </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B] leading-none">
                VERITY
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-medium tracking-[0.45em] text-[#D4AF37]/85 uppercase mt-0.5 leading-none">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          {/* CENTRE: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors duration-200 group ${
                    isActive ? 'text-[#F3D98B] font-semibold' : 'text-[#F5F1E6]/90 hover:text-[#F3D98B]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span 
                    className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3D98B] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} 
                  />
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Explore Demo (Gold Outline Button) */}
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#D4AF37]/10 text-[#F3D98B] font-semibold border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all active:scale-95 text-xs tracking-wide"
            >
              Explore Demo
            </button>

            {/* Sign In (Solid Gold Gradient Button) */}
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="btn-gold-sweep px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] hover:brightness-110 text-[#060B1F] font-bold shadow-glow transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#060B1F]" />
            </button>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#111B3D] text-[#F3D98B] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE: Slide-in Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0A1230]/98 backdrop-blur-2xl border-b border-[#D4AF37]/40 shadow-2xl py-6 px-6 z-50 animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2 text-base font-medium border-b border-[#18285A] transition-colors ${
                    isActive ? 'text-[#F3D98B] font-bold' : 'text-[#F5F1E6]/90 hover:text-[#F3D98B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 rounded-xl border border-[#D4AF37] text-[#F3D98B] font-semibold text-center text-sm"
              >
                Explore Demo
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] text-[#060B1F] font-bold text-center text-sm shadow-glow"
              >
                Sign In
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
