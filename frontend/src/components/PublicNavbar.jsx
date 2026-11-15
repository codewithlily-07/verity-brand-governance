import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

/**
 * PublicNavbar
 * - Background rgba(5,8,20,0.9) with backdrop-filter blur(14px)
 * - Height: 72px resting, shrinks to 60px on scroll
 * - Bottom border 1px gold at 30% opacity with a soft gold glow line that increases on scroll
 * - Links #D4AF37, weight 500. Hover #F3D98B with sliding gold underline & faint text glow. Active has gold dot.
 * - "Sign In": solid gold gradient (#F3D98B to #D4AF37 to #A67C00), navy text, weight 700, shimmer sweep every 4s.
 * - "Explore Demo": gold outline, gold text, glow on hover.
 */
export function PublicNavbar({ activePage = 'landing', setActivePage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'product', label: 'Product' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'trust-security', label: 'Trust & Security' },
    { id: 'resources', label: 'Resources' },
    { id: 'quality', label: 'Quality' },
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
      className="sticky top-0 left-0 right-0 z-50 w-full flex items-center transition-all duration-300"
      style={{
        height: isScrolled ? '60px' : '72px',
        backgroundColor: 'rgba(5, 8, 20, 0.90)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(212, 175, 55, 0.50)' : 'rgba(212, 175, 55, 0.30)'}`,
        boxShadow: isScrolled 
          ? '0 2px 30px rgba(212, 175, 55, 0.35), 0 10px 30px rgba(5, 8, 20, 0.95)'
          : '0 1px 24px rgba(212, 175, 55, 0.15)',
      }}
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Logo & Wordmark */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="VERITY Home"
          >
            {/* Calligraphic Gold V Mark */}
            <div className="relative w-8 h-7 sm:w-9 sm:h-8 flex items-center justify-center transition-transform group-hover:scale-105">
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
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#F3D98B] via-[#D4AF37] to-[#F3D98B] leading-none">
                VERITY
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-medium tracking-[0.42em] text-[#D4AF37]/80 uppercase mt-0.5 leading-none">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="relative py-1 group outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded"
                  style={{
                    color: isActive ? '#F3D98B' : '#D4AF37',
                    fontSize: '15px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  <span 
                    className="transition-colors duration-200 group-hover:text-[#F3D98B]"
                    style={{
                      textShadow: isActive ? '0 0 10px rgba(243, 217, 139, 0.45)' : 'none'
                    }}
                  >
                    {link.label}
                  </span>

                  {/* Underline sliding in from left on hover */}
                  <span 
                    className="absolute bottom-0 left-0 h-[1.5px] bg-[#F3D98B] transition-all duration-300 pointer-events-none w-0 group-hover:w-full"
                    style={{
                      boxShadow: '0 0 8px rgba(243, 217, 139, 0.7)'
                    }}
                  />

                  {/* Active Page: small gold dot under it */}
                  {isActive && (
                    <span 
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] pointer-events-none"
                      style={{
                        boxShadow: '0 0 6px #D4AF37'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Explore Demo (gold outline, gold text, glow on hover) */}
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="px-4 py-2 rounded-xl bg-transparent border border-[#D4AF37] text-[#D4AF37] text-[14px] font-medium tracking-wide transition-all duration-200 hover:bg-[#D4AF37]/15 hover:text-[#F3D98B] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-[0.98]"
            >
              Explore Demo
            </button>

            {/* Sign In (solid gold gradient, navy text, weight 700, shimmer sweep every 4s) */}
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="btn-gold-sweep px-5 py-2 rounded-xl text-[#050814] text-[14px] font-bold tracking-wide shadow-gold-glow flex items-center gap-1.5 transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
              }}
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#050814] stroke-[2.5]" />
            </button>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#050814] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE: Slide-in Panel */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 bg-[#050814]/98 backdrop-blur-2xl border-b border-[#D4AF37]/40 shadow-2xl py-6 px-6 z-50 animate-in slide-in-from-top-3 duration-200"
          style={{ top: isScrolled ? '60px' : '72px' }}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2.5 text-base font-medium border-b border-[#14224F]/40 transition-colors flex items-center justify-between ${
                    isActive ? 'text-[#F3D98B] font-bold' : 'text-[#D4AF37] hover:text-[#F3D98B]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />}
                </button>
              );
            })}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-2.5 rounded-xl border border-[#D4AF37] text-[#D4AF37] font-semibold text-center text-sm hover:bg-[#D4AF37]/15 transition-colors"
              >
                Explore Demo
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="btn-gold-sweep w-full py-2.5 rounded-xl text-[#050814] font-bold text-center text-sm shadow-gold-glow"
                style={{
                  background: 'linear-gradient(135deg, #F3D98B, #D4AF37 50%, #A67C00)',
                }}
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
