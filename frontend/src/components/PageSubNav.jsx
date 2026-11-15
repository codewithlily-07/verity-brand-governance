import React, { useState, useEffect } from 'react';

export function PageSubNav({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Scroll progress bar calculation
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollVal = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrollVal)));

      // 2. Active section detection
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Thin Gold Scroll-Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[2.5px] z-50 pointer-events-none transition-all duration-75"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #F3D98B 0%, #D4AF37 50%, #A67C00 100%)',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.65)',
        }}
      />

      {/* Sticky Sub-navigation Bar */}
      <div 
        className="sticky top-[60px] sm:top-[72px] z-30 w-full py-2.5 px-4 select-none border-b"
        style={{
          backgroundColor: 'rgba(5, 8, 20, 0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderColor: 'rgba(212, 175, 55, 0.20)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F3D98B] to-[#D4AF37] text-[#050814] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                    : 'text-[#9AA6C7] hover:text-[#F7F2E7] hover:bg-white/5 border border-transparent'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

