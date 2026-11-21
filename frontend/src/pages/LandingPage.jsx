import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, TrendingUp, Sparkles, ArrowRight,
  UserCheck, Cpu, KeyRound, Database
} from 'lucide-react';
import { HeroTwoColumn } from '../components/hero/HeroTwoColumn';

/**
 * HOME PAGE: EXACTLY 6 SECTIONS WITH THESE BACKGROUNDS
 * Section 1, Hero (navy #050A1F): Two-column layout with concentric globe on right.
 * Section 2, Features (IVORY #F7F2E7): 3 white cards with thin gold border, navy text, gold icon in navy circle.
 * Section 3, Lifecycle (CHARCOAL #0B0E14): Horizontal gold line connecting 4 nodes (01-04).
 * Section 4, Trust (NAVY #0A1230): 4 glass badges in one row (no SOC 2 or WCAG).
 * Section 5, Call to Action (Full-width GOLD GRADIENT band): Navy text & dark navy button.
 * Section 6, Footer (INK #05070F): Handled by App.jsx to prevent duplicate footer.
 */
export function LandingPage({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const darkSectionRef = useRef(null);

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) {
      setActivePage(page);
    }
  };

  const handleMouseMoveDark = (e) => {
    if (prefersReduced || !darkSectionRef.current) return;
    const rect = darkSectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full text-[#3F4A5F] select-none" style={{ backgroundColor: '#FAF7F0' }}>
      
      {/* ==================================================
          SECTION 1: HERO (WARM IVORY #FAF7F0)
          Two-column layout on desktop: Left copy & CTAs, Right concentric globe.
          Fills screen min-height calc(100vh - 76px)
          ================================================== */}
      <HeroTwoColumn setActivePage={setActivePage} />

      {/* ==================================================
          SECTION 2: FEATURES (WARM SAND BACKGROUND #F1ECE0)
          Title: "Three steps to publish with confidence"
          Three white cards with thin gold/sand border and navy text,
          gold icon inside warm ivory circle, max 12 words per card.
          ================================================== */}
      <section 
        className="py-24 sm:py-28 relative"
        style={{
          backgroundColor: '#F1ECE0',
          borderTop: '1px solid #E3DCCB',
          borderBottom: '1px solid #E3DCCB',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-xs font-mono font-semibold text-[#8A6A24] uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B8862B]" />
              <span>CORE ARCHITECTURE</span>
            </div>
            
            <h2 className="text-fluid-h2 font-serif font-bold text-[#14213D] mb-4">
              Three steps to publish with confidence
            </h2>
            <div className="title-gold-underline mx-auto mb-4" />
            <p className="text-[17px] text-[#3F4A5F] font-sans leading-relaxed">
              Deterministic rule execution, approved fact verification, and tamper-evident human authority.
            </p>
          </div>

          {/* Three White Cards with Thin Gold Border, Navy Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Review */}
            <div 
              className="luxury-card-hover bg-white rounded-2xl p-8 flex flex-col justify-between cursor-pointer group"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('how-it-works')}
            >
              <div>
                {/* Gold icon inside ivory circle */}
                <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-[#B8862B] flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
                  <FileSearch className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#14213D] mb-3">
                  Review
                </h3>
                {/* Exact copy (9 words) */}
                <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans mb-6">
                  Catches off-brand wording and terminology before you publish.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3DCCB] flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#7A5B18] group-hover:text-[#14213D] transition-colors inline-flex items-center gap-1.5">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[13px] font-mono font-bold text-[#7A5B18]">01</span>
              </div>
            </div>

            {/* Card 2: Verify */}
            <div 
              className="luxury-card-hover bg-white rounded-2xl p-8 flex flex-col justify-between cursor-pointer group"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('how-it-works')}
            >
              <div>
                {/* Gold icon inside ivory circle */}
                <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-[#B8862B] flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#14213D] mb-3">
                  Verify
                </h3>
                {/* Exact copy (8 words) */}
                <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans mb-6">
                  Checks every claim against your approved knowledge base.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3DCCB] flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#7A5B18] group-hover:text-[#14213D] transition-colors inline-flex items-center gap-1.5">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[13px] font-mono font-bold text-[#7A5B18]">02</span>
              </div>
            </div>

            {/* Card 3: Govern */}
            <div 
              className="luxury-card-hover bg-white rounded-2xl p-8 flex flex-col justify-between cursor-pointer group"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('trust-security')}
            >
              <div>
                {/* Gold icon inside ivory circle */}
                <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-[#B8862B] flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:scale-105">
                  <TrendingUp className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#14213D] mb-3">
                  Govern
                </h3>
                {/* Exact copy (10 words) */}
                <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans mb-6">
                  A human signs off. A tamper-proof SHA-256 seal records it.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E3DCCB] flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#7A5B18] group-hover:text-[#14213D] transition-colors inline-flex items-center gap-1.5">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[13px] font-mono font-bold text-[#7A5B18]">03</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          SECTION 3: LIFECYCLE (WARM IVORY #FAF7F0)
          Title: "From draft to approved in four steps"
          Horizontal gold line connecting 4 nodes with outlined gold numbers 01-04,
          white cards with navy headings and readable body text (16px),
          gentle hover lift that never covers or fades text.
          ================================================== */}
      <section 
        className="py-24 sm:py-28 relative overflow-hidden"
        style={{
          backgroundColor: '#FAF7F0',
          borderBottom: '1px solid #E3DCCB',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-[#7A5B18] uppercase block mb-3">
              WORKFLOW PIPELINE
            </span>
            <h2 className="text-fluid-h2 font-serif font-bold text-[#14213D] mb-4">
              From draft to approved in four steps
            </h2>
            <div className="title-gold-underline mx-auto mb-4" />
            <p className="text-[17px] text-[#3F4A5F] font-sans leading-relaxed">
              Every release is checked, matched, aligned, and authoritatively sealed.
            </p>
          </div>

          {/* Horizontal Gold Line & 4 Steps Grid */}
          <div className="relative">
            
            {/* Desktop Continuous Horizontal Gold Connector Line */}
            <div 
              className="hidden lg:block absolute top-[44px] left-[6%] right-[6%] h-[2px] pointer-events-none z-0"
              style={{
                background: 'linear-gradient(90deg, rgba(184,134,43,0.2) 0%, rgba(201,162,75,0.7) 50%, rgba(184,134,43,0.2) 100%)',
                boxShadow: '0 0 8px rgba(184,134,43,0.2)',
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 01 Review */}
              <div 
                className="luxury-card-hover bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
                style={{
                  border: '1px solid #E3DCCB',
                  boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Glowing gold node on the timeline */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#C9A24B] flex items-center justify-center shadow-[0_0_10px_rgba(201,162,75,0.3)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7A5B18]" />
                    </div>
                    {/* Gold number 01 */}
                    <span 
                      className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#7A5B18]/75"
                    >
                      01
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#14213D] mb-2.5">
                    Review
                  </h3>
                  {/* Exact copy (9 words) */}
                  <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans">
                    Upload a draft. We scan wording, terms and format.
                  </p>
                </div>
              </div>

              {/* Step 02 Verify */}
              <div 
                className="luxury-card-hover bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
                style={{
                  border: '1px solid #E3DCCB',
                  boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Glowing gold node on the timeline */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#C9A24B] flex items-center justify-center shadow-[0_0_10px_rgba(201,162,75,0.3)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7A5B18]" />
                    </div>
                    {/* Gold number 02 */}
                    <span 
                      className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#7A5B18]/75"
                    >
                      02
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#14213D] mb-2.5">
                    Verify
                  </h3>
                  {/* Exact copy (7 words) */}
                  <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans">
                    Every claim is matched to approved sources.
                  </p>
                </div>
              </div>

              {/* Step 03 Align */}
              <div 
                className="luxury-card-hover bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
                style={{
                  border: '1px solid #E3DCCB',
                  boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Glowing gold node on the timeline */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#C9A24B] flex items-center justify-center shadow-[0_0_10px_rgba(201,162,75,0.3)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7A5B18]" />
                    </div>
                    {/* Gold number 03 */}
                    <span 
                      className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#7A5B18]/75"
                    >
                      03
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#14213D] mb-2.5">
                    Align
                  </h3>
                  {/* Exact copy (8 words) */}
                  <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans">
                    Side-by-side fixes that keep the author’s voice.
                  </p>
                </div>
              </div>

              {/* Step 04 Govern */}
              <div 
                className="luxury-card-hover bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
                style={{
                  border: '1px solid #E3DCCB',
                  boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Glowing gold node on the timeline */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#C9A24B] flex items-center justify-center shadow-[0_0_10px_rgba(201,162,75,0.3)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#7A5B18]" />
                    </div>
                    {/* Gold number 04 */}
                    <span 
                      className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#7A5B18]/75"
                    >
                      04
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#14213D] mb-2.5">
                    Govern
                  </h3>
                  {/* Exact copy (10 words) */}
                  <p className="text-[16px] text-[#3F4A5F] leading-relaxed font-sans">
                    A reviewer signs off. The decision is sealed and logged.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          SECTION 4: TRUST (WARM SAND #F1ECE0)
          Clean light section with 4 white cards with glowing gold icons:
          - "Human-in-the-loop"
          - "Deterministic rule engine"
          - "SHA-256 audit seals"
          - "No model training on your data"
          ================================================== */}
      <section 
        className="py-24 sm:py-28 relative overflow-hidden"
        style={{
          backgroundColor: '#F1ECE0',
          borderBottom: '1px solid #E3DCCB',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-fluid-h2 font-serif font-bold text-[#14213D] mb-3">
              Enterprise Trust & Governance
            </h2>
            <div className="title-gold-underline mx-auto mb-3" />
            <p className="text-[17px] text-[#3F4A5F] font-sans">
              Engineered with zero auto-approval and tamper-proof verification.
            </p>
          </div>

          {/* 4 Cards in One Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Badge 1: Human-in-the-loop */}
            <div 
              className="luxury-card-hover p-6 rounded-2xl flex items-center gap-4 cursor-pointer bg-white"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('trust-security')}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#C9A24B]/40 flex items-center justify-center text-[#B8862B] shrink-0 shadow-sm">
                <UserCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[17px] font-semibold text-[#14213D] leading-snug">
                  Human-in-the-loop
                </h4>
                <p className="text-[14px] text-[#3F4A5F] mt-0.5">
                  Zero auto-publishing
                </p>
              </div>
            </div>

            {/* Badge 2: Deterministic rule engine */}
            <div 
              className="luxury-card-hover p-6 rounded-2xl flex items-center gap-4 cursor-pointer bg-white"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('how-it-works')}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#C9A24B]/40 flex items-center justify-center text-[#B8862B] shrink-0 shadow-sm">
                <Cpu className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[17px] font-semibold text-[#14213D] leading-snug">
                  Deterministic rule engine
                </h4>
                <p className="text-[14px] text-[#3F4A5F] mt-0.5">
                  AST syntactic checks
                </p>
              </div>
            </div>

            {/* Badge 3: SHA-256 audit seals */}
            <div 
              className="luxury-card-hover p-6 rounded-2xl flex items-center gap-4 cursor-pointer bg-white"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('trust-security')}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#C9A24B]/40 flex items-center justify-center text-[#B8862B] shrink-0 shadow-sm">
                <KeyRound className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[17px] font-semibold text-[#14213D] leading-snug">
                  SHA-256 audit seals
                </h4>
                <p className="text-[14px] text-[#3F4A5F] mt-0.5">
                  Immutable records
                </p>
              </div>
            </div>

            {/* Badge 4: No model training on your data */}
            <div 
              className="luxury-card-hover p-6 rounded-2xl flex items-center gap-4 cursor-pointer bg-white"
              style={{
                border: '1px solid #E3DCCB',
                boxShadow: '0 8px 24px rgba(20, 33, 61, 0.08)',
              }}
              onClick={() => handleNav('trust-security')}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#C9A24B]/40 flex items-center justify-center text-[#B8862B] shrink-0 shadow-sm">
                <Database className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[17px] font-semibold text-[#14213D] leading-snug">
                  No model training on your data
                </h4>
                <p className="text-[14px] text-[#3F4A5F] mt-0.5">
                  Isolated tenant storage
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          SECTION 5: CALL TO ACTION (WARM IVORY / SAND GRADIENT)
          Navy text: "Ready to protect your brand equity?"
          Primary button: Gold with navy text
          Secondary button: White with navy border
          ================================================== */}
      <section 
        className="py-24 relative overflow-hidden text-center"
        style={{
          background: 'linear-gradient(180deg, #F1ECE0 0%, #FAF7F0 100%)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border border-[#C9A24B]/40 text-xs font-mono font-bold text-[#8A6A24] uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B8862B]" />
            <span>ENTERPRISE READINESS</span>
          </div>

          {/* Navy Text */}
          <h2 className="text-fluid-h2 font-serif font-bold text-[#14213D] mb-4">
            Ready to protect your brand equity?
          </h2>
          
          <p className="text-[18px] text-[#3F4A5F] max-w-xl mx-auto mb-10 font-sans leading-relaxed">
            Eliminate off-brand leaks, verify sensitive claims against source documents, and empower your compliance team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Gold Button with Navy Text */}
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className="px-8 py-4 rounded-xl text-[#14213D] font-bold text-[15px] tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-[0_8px_20px_rgba(201,162,75,0.3)] active:scale-[0.98] hover:bg-[#B8862B] hover:text-white"
              style={{
                backgroundColor: '#C9A24B',
              }}
            >
              <span>Explore Demo Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#14213D] group-hover:text-white" />
            </button>

            {/* White Button with Navy Border */}
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="px-7 py-4 rounded-xl bg-white text-[#14213D] hover:bg-[#FAF7F0] border border-[#14213D] font-semibold text-[15px] tracking-wide transition-all active:scale-[0.98]"
            >
              See How It Works
            </button>
          </div>

        </div>
      </section>

      {/* Note: Section 6 Footer is rendered strictly once by App.jsx,
          guaranteeing exactly ONE footer across all viewports and routes! */}

    </div>
  );
}
