import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { StarfieldCanvas } from './StarfieldCanvas';
import { CinematicGlobe } from './CinematicGlobe';

/**
 * Animated Drawing Checkmark SVG
 */
function DrawingCheck({ delay = 0 }) {
  const prefersReduced = useReducedMotion();
  return (
    <svg 
      className="w-4 h-4 shrink-0 text-[#B8862B]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(184, 134, 43, 0.4)" strokeWidth="1.5" />
      <motion.path 
        d="m9 12 2 2 4-4" 
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: delay, ease: 'easeOut' }}
      />
    </svg>
  );
}

/**
 * Rebuilt VERITY Hero Component (Warm Premium Light Theme):
 * - Light ivory warm background (--bg: #FAF7F0) with delicate gold aura & starfield specks
 * - Left Column:
 *   - Live indicator pulsing dot in eyebrow
 *   - Line-by-line slide-up H1 reveal with 120ms stagger in deep navy #14213D
 *   - Subtext max-width 560px, 16px, deep body text #3F4A5F
 *   - High-contrast gold button (--gold-btn: #C9A24B) with navy #14213D text
 *   - Secondary button in white #FFFFFF with navy #14213D border
 *   - Proof line items fade in with self-drawing checks
 * - Right Column:
 *   - CinematicGlobe (perfect circle, concentric 3D orbit rings, open book, 4 floating HUD cards)
 */
export function HeroTwoColumn({ setActivePage }) {
  const prefersReduced = useReducedMotion();

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  const handleExplore = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('verity:open-role-picker'));
    } else {
      handleNav('dashboard');
    }
  };

  return (
    <section 
      className="relative w-full flex items-center justify-center overflow-hidden py-6 lg:py-4 select-none"
      style={{
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: '#FAF7F0',
        backgroundImage: `
          radial-gradient(circle at 75% 45%, rgba(201, 162, 75, 0.15) 0%, transparent 55%),
          radial-gradient(circle at 18% 25%, rgba(241, 236, 224, 0.9) 0%, transparent 60%)
        `,
      }}
    >
      {/* 1. Background Starfield Canvas: 80 stars + 25 gold particles */}
      <StarfieldCanvas />

      {/* 2. Faint Grid Texture at 4% opacity */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(184, 134, 43, 0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.35,
        }}
      />

      {/* 3. Soft Gold Light Sweep Crossing the Hero Every 12s */}
      {!prefersReduced && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        >
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 2,
            }}
            className="w-1/2 h-full opacity-20 transform -skew-x-12"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(201, 162, 75, 0.20) 50%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] items-center py-4 lg:py-6"
          style={{
            gap: 'clamp(24px, 4vw, 56px)',
          }}
        >
          
          {/* ==========================================
              LEFT COLUMN: HERO MESSAGING & CTAs
              - max-width: 600px
              - dedicated grid track
              - never overlaps globe column
              ========================================== */}
          <div className="flex flex-col items-start text-left z-10 overflow-hidden max-w-[600px]">
            
            {/* Eyebrow in Inter 12px, weight 600, uppercase, 0.08em tracking */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1ECE0] border border-[#B8862B]/40 text-[12px] font-sans font-semibold text-[#7A5B18] tracking-[0.08em] uppercase mb-4 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8862B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8862B]" />
              </span>
              <span>Brand Governance for Fast Teams</span>
            </div>

            {/* H1 Heading: 3 lines, clamp(1.8rem, 2.6vw, 2.5rem), line-height 1.2, letter-spacing 0 */}
            <h1 
              className="font-serif font-semibold text-[#14213D] mb-4"
              style={{
                fontSize: 'clamp(1.8rem, 2.6vw, 2.5rem)',
                lineHeight: 1.2,
                letterSpacing: 0,
              }}
            >
              <span className="block overflow-hidden whitespace-nowrap">
                <motion.span 
                  initial={prefersReduced ? { y: 0 } : { y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-semibold"
                >
                  Every Claim Checked.
                </motion.span>
              </span>
              <span className="block overflow-hidden whitespace-nowrap">
                <motion.span 
                  initial={prefersReduced ? { y: 0 } : { y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="block font-semibold"
                >
                  Every Rule Enforced.
                </motion.span>
              </span>
              <span className="block overflow-hidden whitespace-nowrap">
                <motion.span 
                  initial={prefersReduced ? { y: 0 } : { y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#B8862B] not-italic font-semibold block"
                >
                  Every Release Human&#8209;Approved.
                </motion.span>
              </span>
            </h1>

            {/* Subtext: max 3 lines, 16px, body color #3F4A5F */}
            <p 
              className="leading-relaxed mb-6 font-sans"
              style={{
                maxWidth: '560px',
                fontSize: '16.5px',
                lineHeight: 1.6,
                color: '#3F4A5F',
              }}
            >
              Verity checks drafts against your approved sources, shows the evidence for every finding, and leaves the final decision to an authorised human reviewer.
            </p>

            {/* CTAs: Full Opacity Always */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6">
              
              {/* Explore Demo Workspace: Gold-btn #C9A24B with navy #14213D text */}
              <button
                type="button"
                onClick={handleExplore}
                className="btn-gold-sweep group relative px-7 py-3 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-[0_4px_16px_rgba(201,162,75,0.35)]"
                style={{
                  backgroundColor: '#C9A24B',
                  color: '#14213D',
                  opacity: 1,
                }}
              >
                <span className="relative z-10 font-bold" style={{ color: '#14213D' }}>Explore Demo Workspace</span>
                <ArrowRight className="w-4 h-4 text-[#14213D] stroke-[2.5] relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* See How It Works: Secondary = white with navy border */}
              <button
                type="button"
                onClick={() => handleNav('how-it-works')}
                className="relative overflow-hidden group px-6 py-3 rounded-xl bg-white text-[#14213D] font-semibold text-[15px] tracking-wide transition-colors duration-200 active:scale-[0.98] text-center cursor-pointer border-[1.5px] border-[#14213D] hover:bg-[#F1ECE0]"
              >
                <span className="relative z-10 font-semibold text-[#14213D]">
                  See How It Works
                </span>
              </button>
            </div>

            {/* Proof Line for Judges: 3 items with 14px chips */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-sans font-medium text-[#3F4A5F]">
              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex items-center gap-1.5"
              >
                <DrawingCheck delay={0.45} />
                <span>No training on customer data</span>
              </motion.div>

              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.50 }}
                className="flex items-center gap-1.5"
              >
                <DrawingCheck delay={0.60} />
                <span>Deterministic rules first</span>
              </motion.div>

              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="flex items-center gap-1.5"
              >
                <DrawingCheck delay={0.75} />
                <span>Authorised human sign-off</span>
              </motion.div>
            </div>

          </div>


          {/* ==========================================
              RIGHT COLUMN: CINEMATIC GLOBE & 4 CARDS
              ========================================== */}
          <div className="flex items-center justify-center relative w-full">
            <CinematicGlobe setActivePage={setActivePage} />
          </div>

        </div>
      </div>

      {/* Thin Gold Gradient Divider at the Bottom Edge of Hero */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.35) 50%, transparent 100%)',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.25)',
        }}
      />
    </section>
  );
}
