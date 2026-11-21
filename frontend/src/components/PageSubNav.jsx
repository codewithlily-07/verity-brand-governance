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
          background: 'linear-gradient(90deg, #F3EAD3 0%, #E2B857 50%, #8A6A24 100%)',
          boxShadow: '0 0 10px rgba(226, 184, 87, 0.65)',
        }}
      />

      {/* Sticky Sub-navigation Bar */}
      <div 
        className="sticky top-[60px] sm:top-[72px] z-30 w-full min-h-[44px] py-1.5 px-4 select-none border-b border-[#F3EAD3]/30 bg-[#13203F] backdrop-blur-md shadow-md"
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-h-[44px]">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`inline-flex items-center justify-center px-4 py-2 min-h-[44px] rounded-full text-sm tracking-wide transition-all whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E2B857] ${
                  isActive
                    ? 'bg-[#E2B857] text-[#101B35] font-bold shadow-[0_2px_10px_rgba(226,184,87,0.35)]'
                    : 'text-[#FAF8F2] hover:text-[#FAF8F2] hover:underline hover:decoration-[#E2B857] hover:underline-offset-4 bg-transparent'
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

