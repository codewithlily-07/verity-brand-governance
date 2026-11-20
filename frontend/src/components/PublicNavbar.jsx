import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

/**
 * PublicNavbar
 * - Height: 72px resting, sticky at the top
 * - Background: rgba(10, 18, 38, 0.72) with backdrop-filter: blur(12px) saturate(120%)
 * - Soft champagne hairline (1px) along bottom edge fading out at both ends with faint glow
 * - On scroll (after 40px): opacity to 0.9, shadow 0 10px 30px rgba(0,0,0,0.28)
 * - Links: ivory #F4F1E8 at 16px; hover turns champagne #EBD9A0; active page has short 2px champagne underline (18px wide)
 * - Explore Demo: transparent with 1px champagne border and ivory text
 * - Sign In: solid gold #E2B857 with midnight #0A1226 text, weight 700
 * - Collapses to hamburger below 1024px (lg:)
 */
export function PublicNavbar({ activePage = 'landing', setActivePage, onOpenRolePicker }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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

  const handleLogoClick = () => {
    handleNavClick('landing');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('verity:replay-intro'));
    }
  };

  const handleExploreClick = () => {
    if (onOpenRolePicker) {
      onOpenRolePicker();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('verity:open-role-picker'));
    } else {
      handleNavClick('dashboard');
    }
  };

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 w-full flex items-center transition-all duration-300 relative"
      style={{
        height: '72px',
        backgroundColor: isScrolled ? 'rgba(10, 18, 38, 0.92)' : 'rgba(10, 18, 38, 0.72)',
        backdropFilter: 'blur(12px) saturate(120%)',
        WebkitBackdropFilter: 'blur(12px) saturate(120%)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.28)' : 'none',
      }}
    >
      {/* 1px soft champagne hairline along the bottom edge fading out at both ends */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(226,184,87,0.45) 18%, rgba(244,226,170,0.85) 50%, rgba(226,184,87,0.45) 82%, transparent 100%)',
          boxShadow: '0 1px 18px rgba(226, 184, 87, 0.10)',
        }}
      />

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Logo & Wordmark */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="VERITY Home (Click to replay opening seal)"
          >
            {/* Calligraphic Gold V Mark */}
            <div className="relative w-8 h-7 sm:w-9 sm:h-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_12px_rgba(226,184,87,0.5)]" fill="none">
                <defs>
                  <linearGradient id="navV1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A6A24"/>
                    <stop offset="40%" stopColor="#E2B857"/>
                    <stop offset="70%" stopColor="#F4E2AA"/>
                    <stop offset="100%" stopColor="#B9822A"/>
                  </linearGradient>
                  <linearGradient id="navV2" x1="0%" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A6A1A"/>
                    <stop offset="50%" stopColor="#F3EAD3"/>
                    <stop offset="100%" stopColor="#FFF9E6"/>
                  </linearGradient>
                </defs>
                <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#navV1)"/>
                <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#F4E2AA" opacity=".55"/>
                <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#navV2)"/>
                <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
              </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-[#F4E2AA] via-[#E2B857] to-[#F4E2AA] leading-none">
                VERITY
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans font-semibold tracking-[0.38em] text-[#EBD9A0] uppercase mt-0.5 leading-none">
                BRAND GOVERNANCE
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links (Desktop: lg+) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="relative py-2 group outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857] rounded"
                  style={{
                    color: '#F4F1E8',
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  <span className="transition-colors duration-200 group-hover:text-[#EBD9A0]">
                    {link.label}
                  </span>

                  {/* Active Page: short 2px champagne underline (~18px wide) centred under label */}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[2px] rounded-full pointer-events-none"
                      style={{
                        backgroundColor: '#E2B857',
                        boxShadow: '0 0 8px rgba(226, 184, 87, 0.6)'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Explore Demo (transparent, 1px champagne border, ivory text) */}
            <button
              type="button"
              onClick={handleExploreClick}
              className="px-4 py-2 min-h-[44px] rounded-xl bg-transparent border border-[#E2B857]/70 text-[#F4F1E8] text-[15px] font-medium tracking-wide transition-all duration-200 hover:bg-[#E2B857]/15 hover:text-[#EBD9A0] hover:border-[#E2B857] focus-visible:ring-2 focus-visible:ring-[#E2B857] active:scale-[0.98]"
            >
              Explore Demo
            </button>

            {/* Sign In (solid gold element, midnight text, weight 700) */}
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="px-5 py-2 min-h-[44px] rounded-xl text-[#0A1226] text-[15px] font-bold tracking-wide flex items-center gap-1.5 transition-all duration-200 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#E2B857] active:scale-[0.98]"
              style={{
                backgroundColor: '#E2B857',
                boxShadow: '0 2px 14px rgba(226, 184, 87, 0.35)',
              }}
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#0A1226] stroke-[2.5]" />
            </button>
          </div>

          {/* MOBILE: Hamburger Button (below 1024px) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0A1226] text-[#E2B857] border border-[#E2B857]/40 hover:bg-[#E2B857]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#E2B857]"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE: Slide-in Panel */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-x-0 bg-[#0A1226]/98 backdrop-blur-2xl border-b border-[#E2B857]/30 shadow-2xl py-6 px-6 z-50 animate-in slide-in-from-top-3 duration-200"
          style={{ top: '72px' }}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2.5 text-base font-medium border-b border-white/5 transition-colors flex items-center justify-between ${
                    isActive ? 'text-[#F4F1E8] font-semibold' : 'text-[#D5DBEE] hover:text-[#EBD9A0]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span 
                      className="w-4 h-[2px] rounded-full" 
                      style={{ backgroundColor: '#E2B857' }}
                    />
                  )}
                </button>
              );
            })}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleExploreClick}
                className="w-full py-3 min-h-[44px] rounded-xl border border-[#E2B857]/70 text-[#F4F1E8] font-semibold text-center text-sm hover:bg-[#E2B857]/15 transition-colors"
              >
                Explore Demo
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('login')}
                className="w-full py-3 min-h-[44px] rounded-xl text-[#0A1226] font-bold text-center text-sm"
                style={{
                  backgroundColor: '#E2B857',
                  boxShadow: '0 2px 14px rgba(226, 184, 87, 0.35)',
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
