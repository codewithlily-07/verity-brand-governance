import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, Layers, TrendingUp, 
  FileText, Check, Sparkles 
} from 'lucide-react';
import { DottedGlobeCanvas } from './DottedGlobeCanvas';

/**
 * CinematicGlobe Component:
 * Faithfully brings the master VERITY 3D golden brand artwork to life:
 * - Concentric perfect-circle geometry with clamp() sizing (never an oval)
 * - 3D interactive mouse parallax tilt with smooth easing (disabled on touch)
 * - Pulsing champagne-gold ambient aura and radiant atmospheric glow
 * - 3 tilted 3D orbital rings with traveling luminous highlights
 * - Central 3D winged golden "V" crest with multi-stop gold gradients
 * - Regal serif "VERITY" wordmark + "— BRAND GOVERNANCE —" + 4-pillar tagline
 * - Glowing illuminated open book at the bottom with upward volumetric sunburst light rays
 * - Suspended golden document plaque with checkmark seal & tilted orbital halo
 * - 4 floating glassmorphic HUD cards (Review, Verify, Align, Govern) with
 *   exact icons, titles, punchy subtitles, and thematic background graphic motifs
 * - Luminous flowing golden silk ribbons across the base
 */
export function CinematicGlobe({ setActivePage }) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef(null);

  // Parallax Tilt State
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, ringX: 0, ringY: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReduced || isTouch || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalized between -1 and 1
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    setTilt({
      rotY: normX * 5, // up to 5deg
      rotX: -normY * 5, // up to 5deg
      ringX: -normX * 10,
      ringY: -normY * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotX: 0, rotY: 0, ringX: 0, ringY: 0 });
  };

  const handleNav = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (setActivePage) setActivePage(page);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-full select-none"
      style={{
        perspective: '1200px',
      }}
    >
      {/* =========================================================
          PERFECT CIRCLE GLOBE CONTAINER
          --size: clamp(300px, 28vw, 470px); concentric, aspect-ratio: 1/1
          ========================================================= */}
      <div 
        className="globe relative rounded-full"
        style={{
          width: 'clamp(300px, 28vw, 470px)',
          height: 'clamp(300px, 28vw, 470px)',
          aspectRatio: '1 / 1',
          transform: prefersReduced ? 'none' : `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* =========================================================
            LAYER A: AMBIENT CHAMPAGNE GOLD HALO & AURA
            ========================================================= */}
        <motion.div 
          animate={prefersReduced ? {} : { 
            opacity: [0.55, 0.9, 0.55], 
            scale: [1.28, 1.4, 1.28] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full pointer-events-none -z-20"
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.38) 0%, rgba(243, 217, 139, 0.18) 40%, rgba(10, 18, 48, 0) 72%)',
            filter: 'blur(32px)',
          }}
        />

        {/* =========================================================
            LAYER B: DOTTED DOME IN UPPER-LEFT (Dense at rim, fading toward center)
            ========================================================= */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0"
          style={{
            maskImage: 'radial-gradient(circle at 22% 22%, black 0%, black 38%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(circle at 22% 22%, black 0%, black 38%, transparent 76%)',
          }}
        >
          <DottedGlobeCanvas active={true} />
        </div>

        {/* =========================================================
            LAYER C: THIN PALE-GOLD RIM (1px, soft glow, brightest at top, page gradient visible inside)
            ========================================================= */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none z-10"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderTop: '1.5px solid rgba(255, 246, 208, 0.85)',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.12)',
            background: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          }}
        />

        {/* =========================================================
            LAYER D1: LARGE TILTED ORBIT ELLIPSE CROSSING CIRCLE DIAGONALLY
            ========================================================= */}
        <div 
          className="absolute inset-[-8%] rounded-full pointer-events-none z-20"
          style={{
            transform: 'rotateX(68deg) rotateZ(-26deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div 
            animate={prefersReduced ? {} : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full rounded-full relative"
            style={{
              border: '1.2px solid rgba(212, 175, 55, 0.65)',
              boxShadow: '0 0 16px rgba(212, 175, 55, 0.38)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Traveling Glowing Gold Highlight Dot */}
            <div 
              className="absolute w-2.5 h-2.5 rounded-full bg-[#FFF6D0]"
              style={{
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 18px #D4AF37, 0 0 6px #FFF2B2',
              }}
            />
          </motion.div>
        </div>

        {/* =========================================================
            LAYER D2: SMALLER CONCENTRIC ELLIPSES IN LOWER MIDDLE
            ========================================================= */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-end pb-[15%]"
        >
          <div 
            className="w-[46%] h-[20%] rounded-full relative"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.42)',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.22)',
            }}
          >
            <div 
              className="absolute inset-[18%] rounded-full"
              style={{
                border: '1px solid rgba(243, 217, 139, 0.48)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.25)',
              }}
            />
          </div>
        </div>

        {/* =========================================================
            LAYER E: MAJESTIC CENTER MONOGRAM & TYPOGRAPHY
            - Small Gold V Emblem (approx 16% of globe size)
            - Regal Serif "VERITY" Wordmark in gold with wide tracking
            - "— BRAND GOVERNANCE —" with thin gold divider lines
            - Tagline: "Review · Verify · Align · Govern"
            ========================================================= */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 pt-1">
          
          {/* Faint subtle atmospheric glow to ensure text crispness without obscuring page gradient */}
          <div 
            className="absolute w-[50%] h-[50%] rounded-full pointer-events-none -z-10 opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(14px)',
            }}
          />

          {/* SCULPTED 3D WINGED GOLD "V" CREST (Small, approx 16% of globe) */}
          <motion.div 
            animate={prefersReduced ? {} : { 
              scale: [0.98, 1.03, 0.98],
              filter: [
                'drop-shadow(0 0 16px rgba(212,175,55,0.75))',
                'drop-shadow(0 0 24px rgba(243,217,139,0.95))',
                'drop-shadow(0 0 16px rgba(212,175,55,0.75))'
              ]
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[16%] aspect-[260/190] flex items-center justify-center mb-1"
          >
            <svg viewBox="0 0 260 190" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="crestWingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF6D0" />
                  <stop offset="25%" stopColor="#F3D98B" />
                  <stop offset="60%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8A5A12" />
                </linearGradient>
                <linearGradient id="crestWingRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9E0" />
                  <stop offset="30%" stopColor="#F5DC96" />
                  <stop offset="70%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#6E4408" />
                </linearGradient>
                <linearGradient id="crestHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#F3D98B" stopOpacity="0" />
                </linearGradient>
                <filter id="goldGleam" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Left Wing Swoop with Flared Tip */}
              <path 
                d="M 14 50 C 44 24 94 38 124 102 L 132 168 C 94 138 44 96 14 50 Z" 
                fill="url(#crestWingLeft)" 
                filter="url(#goldGleam)"
              />
              <path 
                d="M 32 56 C 58 46 88 62 114 104 C 84 84 54 68 32 56 Z" 
                fill="url(#crestHighlight)" 
              />

              {/* Right Wing Soaring Feathered Arch */}
              <path 
                d="M 126 172 C 128 108 170 38 256 6 C 200 46 174 104 154 166 C 144 170 134 172 126 172 Z" 
                fill="url(#crestWingRight)" 
                filter="url(#goldGleam)"
              />
              <path 
                d="M 146 144 C 158 98 186 52 238 18 C 196 60 172 104 156 150 Z" 
                fill="#FFFFFF" 
                opacity="0.6" 
              />

              {/* Center Intersect Bevel Point */}
              <circle cx="129" cy="169" r="4" fill="#FFF6D0" filter="drop-shadow(0 0 6px #F3D98B)" />
            </svg>
          </motion.div>

          {/* WORDMARK "VERITY" IN LUXURY SERIF WITH WIDE LETTER-SPACING */}
          <h2 className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF6D0] via-[#F3D98B] to-[#D4AF37] tracking-[0.28em] leading-tight text-xl sm:text-2xl drop-shadow-[0_2px_12px_rgba(212,175,55,0.7)]">
            VERITY
          </h2>

          {/* "— BRAND GOVERNANCE —" WITH THIN GOLD LINES */}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.26em] text-[#D4AF37] uppercase font-semibold">
              BRAND GOVERNANCE
            </span>
            <span className="w-5 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* 4-PILLAR TAGLINE: Review · Verify · Align · Govern */}
          <div className="text-[10px] sm:text-[11px] font-sans tracking-widest text-[#F7F2E7]/90 mt-1 flex items-center">
            <span>Review</span>
            <span className="text-[#D4AF37] mx-1.5 font-bold">·</span>
            <span>Verify</span>
            <span className="text-[#D4AF37] mx-1.5 font-bold">·</span>
            <span>Align</span>
            <span className="text-[#D4AF37] mx-1.5 font-bold">·</span>
            <span>Govern</span>
          </div>
        </div>

        {/* =========================================================
            LAYER F: ILLUMINATED OPEN BOOK WITH RADIANT UPWARD RAYS
            ========================================================= */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center w-full"
          style={{
            bottom: '-10%',
          }}
        >
          {/* Volumetric Upward Radiant Sunbeam Rays */}
          <motion.div 
            animate={prefersReduced ? {} : { opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-56 sm:w-72 h-44 sm:h-52 -mb-10 pointer-events-none"
          >
            <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="sunbeamGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Center Beam */}
              <polygon points="135,200 165,200 190,0 110,0" fill="url(#sunbeamGrad)" filter="blur(6px)" />
              {/* Left Beam 1 */}
              <polygon points="140,200 155,200 80,0 20,0" fill="url(#sunbeamGrad)" opacity="0.6" filter="blur(8px)" />
              {/* Right Beam 1 */}
              <polygon points="145,200 160,200 280,0 220,0" fill="url(#sunbeamGrad)" opacity="0.6" filter="blur(8px)" />
            </svg>
          </motion.div>

          {/* Floating Gold Sparks Rising from the Book */}
          {!prefersReduced && (
            <div className="absolute bottom-8 w-40 h-32 overflow-hidden pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [10, -65],
                    x: [(i % 2 === 0 ? -1 : 1) * (i * 2.5), (i % 2 === 0 ? 1 : -1) * (i * 3)],
                    opacity: [0, 0.9, 0],
                    scale: [0.6, 1.3, 0.4],
                  }}
                  transition={{
                    duration: 3 + (i % 4) * 0.6,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                  className="absolute bottom-2 rounded-full bg-[#FFF6D0]"
                  style={{
                    left: `${18 + (i * 5)}%`,
                    width: `${2 + (i % 3)}px`,
                    height: `${2 + (i % 3)}px`,
                    boxShadow: '0 0 8px #F3D98B',
                  }}
                />
              ))}
            </div>
          )}

          {/* Open Golden Book SVG Base */}
          <div className="relative w-56 sm:w-72 h-14 flex items-center justify-center">
            <svg viewBox="0 0 280 65" className="w-full h-full drop-shadow-[0_0_30px_rgba(212,175,55,1.0)]" fill="none">
              <defs>
                <linearGradient id="bookCoverGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A5A12" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="65%" stopColor="#F3D98B" />
                  <stop offset="100%" stopColor="#B9822A" />
                </linearGradient>
                <linearGradient id="bookPageLuminous" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFF6D0" stopOpacity="0.98" />
                </linearGradient>
              </defs>

              {/* Left Fan */}
              <path d="M 140 52 C 105 48, 52 28, 12 40 C 42 26, 95 20, 140 30 Z" fill="url(#bookCoverGold)" opacity="0.9" />
              <path d="M 140 52 C 105 45, 62 22, 28 32 C 58 18, 105 15, 140 24 Z" fill="url(#bookPageLuminous)" />
              <path d="M 140 52 C 112 40, 75 18, 48 22 C 75 10, 115 10, 140 18 Z" fill="#FFF6D0" opacity="0.95" />

              {/* Right Fan */}
              <path d="M 140 52 C 175 48, 228 28, 268 40 C 238 26, 185 20, 140 30 Z" fill="url(#bookCoverGold)" opacity="0.9" />
              <path d="M 140 52 C 175 45, 218 22, 252 32 C 222 18, 175 15, 140 24 Z" fill="url(#bookPageLuminous)" />
              <path d="M 140 52 C 168 40, 205 18, 232 22 C 205 10, 165 10, 140 18 Z" fill="#FFF6D0" opacity="0.95" />

              {/* Book Spine Node */}
              <circle cx="140" cy="52" r="4.5" fill="#FFFFFF" filter="drop-shadow(0 0 14px #F3D98B)" />
            </svg>
          </div>
        </div>

        {/* =========================================================
            LAYER G: SUSPENDED HOLOGRAPHIC DOCUMENT PLAQUE
            Hovering directly above the book in the beam of light
            - Document card with golden text lines & circular check badge
            - Tilted golden elliptical orbit ring encircling it
            ========================================================= */}
        <div 
          className="absolute z-40 pointer-events-none"
          style={{
            bottom: '16%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            animate={prefersReduced ? {} : { 
              y: [-5, 5, -5],
              scale: [0.98, 1.02, 0.98]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex items-center justify-center"
          >
            {/* Tilted Glowing Orbit Ring around Document */}
            <div 
              className="absolute w-36 h-16 rounded-full border border-[#D4AF37]/90 pointer-events-none -z-10"
              style={{
                transform: 'rotateX(72deg) rotateZ(-12deg)',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.75)',
              }}
            />

            {/* Document Plaque */}
            <div 
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.85)] backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(8, 15, 42, 0.95)',
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#FFF6D0]" />
              </div>
              <div className="space-y-1 pr-1">
                <div className="w-14 h-1.5 rounded-full bg-gradient-to-r from-[#FFF6D0] via-[#F3D98B] to-[#D4AF37]" />
                <div className="w-9 h-1 rounded-full bg-[#9AA6C7]/70" />
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF2B2] to-[#D4AF37] text-[#050814] flex items-center justify-center shadow-[0_0_14px_#F3D98B]">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================
            LAYER H: FLOWING GOLDEN SILK RIBBONS AT BASE
            ========================================================= */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[130%] h-24 pointer-events-none z-10 overflow-hidden opacity-85">
          <svg viewBox="0 0 500 80" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="silkGoldWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="30%" stopColor="#F3D98B" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#FFF6D0" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path 
              d="M 0 55 C 120 20, 220 70, 320 35 C 400 10, 470 50, 500 35" 
              stroke="url(#silkGoldWave)" 
              strokeWidth="2.8" 
              filter="drop-shadow(0 0 12px rgba(212,175,55,0.8))"
            />
            <path 
              d="M 20 65 C 140 35, 240 75, 340 45 C 410 25, 460 55, 490 45" 
              stroke="url(#silkGoldWave)" 
              strokeWidth="1.5" 
              strokeOpacity="0.6" 
            />
          </svg>
        </div>

        {/* =========================================================
            LAYER I: FOUR FLOATING GLASS HUD CARDS
            Directly matching the master reference design:
            1. Review (Analyse your content)
            2. Verify (Check facts & claims)
            3. Align (Keep it on brand)
            4. Govern (Ensure safe publishing)
            ========================================================= */}

        {/* CARD 1: REVIEW (top-left) */}
        <motion.div
          animate={prefersReduced ? {} : { 
            y: [-8, 8, -8],
            rotate: [-1.2, 1.2, -1.2]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ y: -5, scale: 1.05 }}
          onClick={() => handleNav('how-it-works')}
          className="hidden min-[900px]:flex absolute z-40 items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300"
          style={{
            top: '4%',
            left: '-14%',
            backgroundColor: 'rgba(8, 15, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.25)',
          }}
        >
          {/* Subtle Document Stack Graphic Watermark behind card */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-12 border border-[#D4AF37]/30 rounded-lg -rotate-12 pointer-events-none -z-10 opacity-50" />

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162758] to-[#070D22] border border-[#D4AF37] flex items-center justify-center text-[#FFF6D0] shrink-0 shadow-[0_0_16px_rgba(212,175,55,0.4)] group-hover:border-[#FFF6D0]">
            <FileSearch className="w-4 h-4 text-[#F3D98B]" />
          </div>
          <div className="text-left leading-tight pr-1">
            <h4 className="text-[14px] font-serif font-bold text-[#FFF6D0] tracking-wide group-hover:text-[#F3D98B] transition-colors">
              Review
            </h4>
            <p className="text-[12px] text-[#F7F2E7]/85 font-sans whitespace-nowrap mt-0.5">
              Analyse your content
            </p>
          </div>
        </motion.div>

        {/* CARD 2: VERIFY (top-right) */}
        <motion.div
          animate={prefersReduced ? {} : { 
            y: [8, -8, 8],
            rotate: [1.2, -1.2, 1.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          whileHover={{ y: -5, scale: 1.05 }}
          onClick={() => handleNav('how-it-works')}
          className="hidden min-[900px]:flex absolute z-40 items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300"
          style={{
            top: '4%',
            right: '-14%',
            backgroundColor: 'rgba(8, 15, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.25)',
          }}
        >
          {/* Subtle Checklist Card Watermark behind card */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-12 border border-[#D4AF37]/30 rounded-lg rotate-12 pointer-events-none -z-10 opacity-50" />

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162758] to-[#070D22] border border-[#D4AF37] flex items-center justify-center text-[#FFF6D0] shrink-0 shadow-[0_0_16px_rgba(212,175,55,0.4)] group-hover:border-[#FFF6D0]">
            <ShieldCheck className="w-4 h-4 text-[#F3D98B]" />
          </div>
          <div className="text-left leading-tight pr-1">
            <h4 className="text-[14px] font-serif font-bold text-[#FFF6D0] tracking-wide group-hover:text-[#F3D98B] transition-colors">
              Verify
            </h4>
            <p className="text-[12px] text-[#F7F2E7]/85 font-sans whitespace-nowrap mt-0.5">
              Check facts & claims
            </p>
          </div>
        </motion.div>

        {/* CARD 3: ALIGN (bottom-left) */}
        <motion.div
          animate={prefersReduced ? {} : { 
            y: [-7, 7, -7],
            rotate: [1.0, -1.0, 1.0]
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
          whileHover={{ y: -5, scale: 1.05 }}
          onClick={() => handleNav('how-it-works')}
          className="hidden min-[900px]:flex absolute z-40 items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300"
          style={{
            bottom: '14%',
            left: '-14%',
            backgroundColor: 'rgba(8, 15, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.25)',
          }}
        >
          {/* Subtle Stacked Layers Watermark behind card */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-[#D4AF37]/30 rounded-md -rotate-6 pointer-events-none -z-10 opacity-50" />

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162758] to-[#070D22] border border-[#D4AF37] flex items-center justify-center text-[#FFF6D0] shrink-0 shadow-[0_0_16px_rgba(212,175,55,0.4)] group-hover:border-[#FFF6D0]">
            <Layers className="w-4 h-4 text-[#F3D98B]" />
          </div>
          <div className="text-left leading-tight pr-1">
            <h4 className="text-[14px] font-serif font-bold text-[#FFF6D0] tracking-wide group-hover:text-[#F3D98B] transition-colors">
              Align
            </h4>
            <p className="text-[12px] text-[#F7F2E7]/85 font-sans whitespace-nowrap mt-0.5">
              Keep it on brand
            </p>
          </div>
        </motion.div>

        {/* CARD 4: GOVERN (bottom-right) */}
        <motion.div
          animate={prefersReduced ? {} : { 
            y: [7, -7, 7],
            rotate: [-1.0, 1.0, -1.0]
          }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
          whileHover={{ y: -5, scale: 1.05 }}
          onClick={() => handleNav('trust-security')}
          className="hidden min-[900px]:flex absolute z-40 items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer group transition-all duration-300"
          style={{
            bottom: '14%',
            right: '-14%',
            backgroundColor: 'rgba(8, 15, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.65), 0 0 20px rgba(212,175,55,0.25)',
          }}
        >
          {/* Subtle Telemetry Bars Watermark behind card */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-[#D4AF37]/30 rounded-md rotate-6 pointer-events-none -z-10 opacity-50" />

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#162758] to-[#070D22] border border-[#D4AF37] flex items-center justify-center text-[#FFF6D0] shrink-0 shadow-[0_0_16px_rgba(212,175,55,0.4)] group-hover:border-[#FFF6D0]">
            <TrendingUp className="w-4 h-4 text-[#F3D98B]" />
          </div>
          <div className="text-left leading-tight pr-1">
            <h4 className="text-[14px] font-serif font-bold text-[#FFF6D0] tracking-wide group-hover:text-[#F3D98B] transition-colors">
              Govern
            </h4>
            <p className="text-[12px] text-[#F7F2E7]/85 font-sans whitespace-nowrap mt-0.5">
              Ensure safe publishing
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
