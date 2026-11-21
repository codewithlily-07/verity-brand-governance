import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Section 6, Footer (INK #05070F)
 * 4 columns:
 * 1. Brand (logo plus one line)
 * 2. Product (3 links)
 * 3. Resources (Docs, API, Swagger)
 * 4. Team (Team COGNEXA, NECC Hackathon 2026)
 * Thin gold divider, then a bottom bar "© 2026 VERITY"
 */
export function Footer({ setActivePage }) {
  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) {
      setActivePage(page);
    }
  };

  return (
    <footer 
      className="text-[#3F4A5F] pt-20 pb-12 select-none"
      style={{
        backgroundColor: '#F1ECE0',
        borderTop: '1px solid #E3DCCB',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">
          
          {/* Column 1: Brand (logo plus one line) */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNav('landing')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              {/* Calligraphic Gold V Icon */}
              <div className="w-8 h-7 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_10px_rgba(184,134,43,0.35)]" fill="none">
                  <defs>
                    <linearGradient id="footerV1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A5A12"/>
                      <stop offset="35%" stopColor="#B8862B"/>
                      <stop offset="60%" stopColor="#C9A24B"/>
                      <stop offset="100%" stopColor="#8A5A12"/>
                    </linearGradient>
                    <linearGradient id="footerV2" x1="0%" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8A5A12"/>
                      <stop offset="50%" stopColor="#C9A24B"/>
                      <stop offset="100%" stopColor="#FAF7F0"/>
                    </linearGradient>
                  </defs>
                  <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#footerV1)"/>
                  <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#C9A24B" opacity=".6"/>
                  <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#footerV2)"/>
                  <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".35"/>
                </svg>
              </div>

              <div>
                <span className="font-serif font-bold text-xl text-[#14213D] tracking-[0.16em] leading-none block">
                  VERITY
                </span>
                <span className="text-[8px] font-mono tracking-[0.42em] text-[#7A5B18] uppercase block mt-0.5 font-semibold">
                  BRAND GOVERNANCE
                </span>
              </div>
            </div>

            <p className="text-[14px] text-[#3F4A5F] font-sans leading-relaxed max-w-xs">
              AI-powered pre-publication brand governance, deterministic rules, and human sign-off.
            </p>
          </div>

          {/* Column 2: Product (3 links) */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-mono font-bold uppercase tracking-wider text-[#14213D]">
              Product
            </h4>
            <ul className="space-y-2.5 text-[15px] text-[#3F4A5F]">
              <li>
                <button 
                  onClick={() => handleNav('product')} 
                  className="hover:text-[#B8862B] transition-colors text-left"
                >
                  Product Suite
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('brand-hub')} 
                  className="hover:text-[#B8862B] transition-colors text-left"
                >
                  Brand Knowledge Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('new-review')} 
                  className="hover:text-[#B8862B] transition-colors text-left"
                >
                  Pre-Publication Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (Docs, API, Swagger, Quality) */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-mono font-bold uppercase tracking-wider text-[#14213D]">
              Resources
            </h4>
            <ul className="space-y-2.5 text-[15px] text-[#3F4A5F]">
              <li>
                <button 
                  onClick={() => handleNav('resources')} 
                  className="hover:text-[#B8862B] transition-colors text-left cursor-pointer"
                >
                  Docs & Architecture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('quality')} 
                  className="hover:text-[#B8862B] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Quality Results (/quality)</span>
                </button>
              </li>
              <li>
                <a 
                  href="/docs" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#B8862B] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Interactive Swagger</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B8862B]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Team (Team COGNEXA, WCC Forge 48) */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-mono font-bold uppercase tracking-wider text-[#14213D]">
              Team
            </h4>
            <ul className="space-y-2 text-[15px] text-[#3F4A5F]">
              <li className="text-[#14213D] font-medium">
                Team COGNEXA
              </li>
              <li className="text-[14px] text-[#3F4A5F] font-mono">
                WCC Forge 48 · Team Cognexa
              </li>
              <li className="pt-2">
                <p className="text-xs text-[#3F4A5F] font-mono leading-relaxed border-l-2 border-[#B8862B] pl-2.5">
                  AI findings are advisory; an authorised human reviewer owns final approval.
                </p>
              </li>
            </ul>
          </div>

        </div>

        {/* Thin Gold Divider */}
        <div 
          className="w-full h-[1px]" 
          style={{ backgroundColor: '#E3DCCB' }} 
        />

        {/* Bottom Bar: © 2026 VERITY */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[14px] text-[#3F4A5F]">
          <div>
            <span>© 2026 VERITY</span>
          </div>
          <div className="font-mono text-[13px] text-[#7A5B18] font-semibold">
            Your Brand. Your Standards. Every Piece of Content.
          </div>
        </div>

      </div>
    </footer>
  );
}
