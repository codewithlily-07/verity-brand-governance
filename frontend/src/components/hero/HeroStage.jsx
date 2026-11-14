import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, Layers, TrendingUp, CheckCircle, 
  FileText, Check, Sparkles, ArrowRight, ChevronRight, X, Play
} from 'lucide-react';

import { DottedGlobeCanvas } from './DottedGlobeCanvas';
import { RisingRingsLayer } from './RisingRingsLayer';

/**
 * 4 Dedicated Holographic Ghost Backdrops (matching the reference image 1:1)
 */

// GhostDocPanel: angled wireframe draft document with text lines and fold tab
function GhostDocPanel() {
  return (
    <div 
      className="absolute -top-3 -left-7 w-36 sm:w-44 p-3.5 rounded-2xl border border-[#E8B84B]/30 bg-[#071230]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_25px_rgba(232,184,75,0.25)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(18deg) rotateX(12deg) rotateZ(-5deg)',
      }}
    >
      <div className="flex items-center justify-between mb-2 opacity-70">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#E8B84B]" />
          <div className="w-12 h-1.5 rounded bg-[#E8B84B]/60" />
        </div>
        <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-[#E8B84B]/70" />
      </div>
      <div className="space-y-1.5 opacity-50">
        <div className="w-full h-1 rounded bg-[#FFF1B8]/80" />
        <div className="w-4/5 h-1 rounded bg-[#FFF1B8]/60" />
        <div className="w-full h-1 rounded bg-[#FFF1B8]/80" />
        <div className="w-3/5 h-1 rounded bg-[#FFF1B8]/50" />
      </div>
    </div>
  );
}

// GhostChecklistPanel: angled wireframe checklist card with checkmarks & rule lines
function GhostChecklistPanel() {
  return (
    <div 
      className="absolute -top-3 -right-7 w-36 sm:w-44 p-3.5 rounded-2xl border border-[#E8B84B]/30 bg-[#071230]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_25px_rgba(232,184,75,0.25)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(-18deg) rotateX(12deg) rotateZ(5deg)',
      }}
    >
      <div className="flex items-center justify-between mb-2 opacity-70">
        <div className="w-14 h-1.5 rounded bg-[#E8B84B]/70" />
        <div className="w-3 h-3 rounded-full border border-[#E8B84B] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF1B8]" />
        </div>
      </div>
      <div className="space-y-2 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm border border-[#FFF1B8]/70 flex items-center justify-center">
              <div className="w-1 h-1 bg-[#FFF1B8]" />
            </div>
            <div className="w-3/4 h-1 rounded bg-[#FFF1B8]/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

// GhostStackPanel: 3 stacked isometric fanned sheets floating in perspective
function GhostStackPanel() {
  return (
    <div 
      className="absolute -top-6 -left-7 w-36 sm:w-44 h-28 pointer-events-none -z-10 flex flex-col justify-center items-center opacity-80 hidden sm:flex"
      style={{
        transform: 'perspective(850px) rotateY(22deg) rotateX(-6deg) rotateZ(-10deg)',
      }}
    >
      <div className="w-28 h-10 rounded-lg border border-[#E8B84B]/40 bg-[#071230]/40 -mb-7 shadow-[0_0_15px_rgba(232,184,75,0.3)] transform -rotate-6" />
      <div className="w-32 h-11 rounded-lg border border-[#FFF1B8]/50 bg-[#0D1D4A]/50 -mb-7 shadow-[0_0_18px_rgba(232,184,75,0.35)] transform -rotate-3" />
      <div className="w-36 h-12 rounded-lg border border-[#E8B84B]/60 bg-[#071230]/60 shadow-[0_0_22px_rgba(232,184,75,0.4)]" />
    </div>
  );
}

// GhostChartPanel: angled analytics card showing upward-stepping bar chart
function GhostChartPanel() {
  return (
    <div 
      className="absolute -top-3 -right-7 w-36 sm:w-44 p-3.5 rounded-2xl border border-[#E8B84B]/30 bg-[#071230]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_25px_rgba(232,184,75,0.25)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(-18deg) rotateX(-6deg) rotateZ(4deg)',
      }}
    >
      <div className="w-14 h-1.5 rounded bg-[#E8B84B]/70 mb-3 opacity-70" />
      <div className="flex items-end justify-between h-11 px-1 opacity-60">
        <div className="w-3 h-3 rounded-t bg-[#E8B84B]/50" />
        <div className="w-3 h-5 rounded-t bg-[#E8B84B]/70" />
        <div className="w-3 h-7 rounded-t bg-[#FFF1B8]/80" />
        <div className="w-3 h-9 rounded-t bg-[#FFF1B8]" />
        <div className="w-3 h-11 rounded-t bg-gradient-to-t from-[#E8B84B] to-[#FFF1B8] shadow-[0_0_10px_#FFF1B8]" />
      </div>
    </div>
  );
}

/**
 * 16:9 Master Hero Stage Container
 * - Exact visual reproduction matching target image (1000127665 / media_1794657912627_930ef8a6.jpg)
 * - 4.5s cinematic intro timeline with skip control and sessionStorage
 * - Living state with 3D card tilt, floating bob, mouse parallax, and tagline sync
 */
export function HeroStage({ setActivePage }) {
  const prefersReduced = useReducedMotion();

  // Check if user has already seen the intro this session
  const [introFinished, setIntroFinished] = useState(() => {
    try {
      return prefersReduced || sessionStorage.getItem('verity_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [introStep, setIntroStep] = useState(introFinished ? 5 : 0);
  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0); // 0: Review, 1: Verify, 2: Align, 3: Govern
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mouse Parallax Offsets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (prefersReduced || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: nx, y: ny });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // 4.5s Intro Sequence Timeline
  useEffect(() => {
    if (introFinished) return;

    // Sequence stages:
    // 0: Initial black/navy
    // 1 (0.4s): Light rises, book opens
    // 2 (1.0s): Sphere & rings assemble
    // 3 (1.6s): Gold V mark wipes in
    // 4 (2.2s): VERITY wordmark & cards fly up from below
    // 5 (3.8s - 4.5s): Settled living state
    const t1 = setTimeout(() => setIntroStep(1), 400);
    const t2 = setTimeout(() => setIntroStep(2), 1000);
    const t3 = setTimeout(() => setIntroStep(3), 1600);
    const t4 = setTimeout(() => setIntroStep(4), 2200);
    const t5 = setTimeout(() => {
      setIntroStep(5);
      setIntroFinished(true);
      try {
        sessionStorage.setItem('verity_intro_seen', 'true');
      } catch (e) {}
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [introFinished]);

  // Keyboard skip (Escape or Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Escape' || e.key === 'Enter') && !introFinished) {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introFinished]);

  const skipIntro = () => {
    setIntroStep(5);
    setIntroFinished(true);
    try {
      sessionStorage.setItem('verity_intro_seen', 'true');
    } catch (e) {}
  };

  // Tagline cycle (every 3.2s) in living state
  useEffect(() => {
    if (introStep < 5) return;
    const interval = setInterval(() => {
      setActiveTaglineIndex((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [introStep]);

  // The 4 Cards
  const cardsData = [
    {
      id: 'review',
      index: 0,
      title: 'Review',
      subtitle: 'Analyse your content',
      icon: FileSearch,
      tooltip: 'Deep syntax, terminology & claim screening on draft copy',
      posStyle: { left: '14%', top: '15%' },
      tilt: 'perspective(900px) rotateY(14deg) rotateX(6deg) rotateZ(-3deg)',
      GhostPanel: GhostDocPanel,
    },
    {
      id: 'verify',
      index: 1,
      title: 'Verify',
      subtitle: 'Check facts & claims',
      icon: ShieldCheck,
      tooltip: 'Strict vector retrieval against approved knowledge vaults',
      posStyle: { right: '14%', top: '15%' },
      tilt: 'perspective(900px) rotateY(-14deg) rotateX(6deg) rotateZ(3deg)',
      GhostPanel: GhostChecklistPanel,
    },
    {
      id: 'align',
      index: 2,
      title: 'Align',
      subtitle: 'Keep it on brand',
      icon: Layers,
      tooltip: 'Harmonizes voice, formatting, and canonical naming standards',
      posStyle: { left: '14%', top: '48%' },
      tilt: 'perspective(900px) rotateY(14deg) rotateX(-4deg) rotateZ(-2deg)',
      GhostPanel: GhostStackPanel,
    },
    {
      id: 'govern',
      index: 3,
      title: 'Govern',
      subtitle: 'Ensure safe publishing',
      icon: TrendingUp,
      tooltip: 'Version-locked approvals, immutable audit logs & SHA-256 seal',
      posStyle: { right: '14%', top: '48%' },
      tilt: 'perspective(900px) rotateY(-14deg) rotateX(-4deg) rotateZ(2deg)',
      GhostPanel: GhostChartPanel,
    },
  ];

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[1680px] mx-auto aspect-[16/9] min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] bg-[#040A1C] text-white overflow-hidden select-none flex items-center justify-center border-b border-[#18285A]"
      style={{
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 20px 80px rgba(4,10,28,0.95)',
      }}
    >
      {/* 1. Deep Midnight Outer Vignette & Background Radial Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 43%, #0D1D4A 0%, #071230 45%, #040A1C 85%)',
          transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
      
      {/* Soft warm golden ambient glow behind the central sphere */}
      <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-radial from-[#F5D061]/25 via-[#E8B84B]/12 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* 2. Dotted Globe Canvas Layer & Continuously Rising Upward Stardust */}
      <DottedGlobeCanvas active={introStep >= 2} progress={introStep >= 2 ? 1 : 0} />

      {/* 3. Continuously Rising Golden Rings Layer */}
      <RisingRingsLayer />

      {/* 4. Central Golden Sphere Luminous Halo & Corona */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={introStep >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none z-10 flex items-center justify-center"
      >
        {/* Soft Golden Core Flare */}
        <div className="absolute inset-0 rounded-full bg-radial from-[#F5D061]/20 via-[#E8B84B]/10 to-transparent blur-xl" />

        {/* Golden Spherical Outer Rim Ring with Intense Specular Bloom */}
        <div 
          className="absolute inset-0 rounded-full border-[1.5px] border-[#E8B84B]/70 pointer-events-none"
          style={{
            boxShadow: '0 0 35px rgba(232, 184, 75, 0.55), inset 0 0 35px rgba(232, 184, 75, 0.35)',
          }}
        />

        {/* Top Crest Corona Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-6 bg-gradient-to-r from-transparent via-[#FFF1B8] to-transparent blur-[2px] opacity-80" />

        {/* Oblique Concentric Elliptical Orbital Ring across the sphere */}
        <div 
          className="absolute w-[124%] h-[42%] rounded-[100%] border border-[#E8B84B]/40 -rotate-[16deg] pointer-events-none"
          style={{
            boxShadow: '0 0 20px rgba(232, 184, 75, 0.25)',
          }}
        >
          {/* Glowing Orbital Nodes */}
          <div className="absolute left-[15%] top-0 w-2.5 h-2.5 rounded-full bg-[#FFF1B8] shadow-[0_0_10px_#FFF1B8]" />
          <div className="absolute right-[20%] bottom-0 w-2 h-2 rounded-full bg-[#E8B84B] shadow-[0_0_8px_#E8B84B]" />
        </div>
      </motion.div>

      {/* 5. Sweeping Golden Silk Light Ribbons (SVG) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 overflow-visible"
        style={{
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <svg viewBox="0 0 1600 900" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="silkLeft" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A5A12" stopOpacity="0" />
              <stop offset="25%" stopColor="#E8B84B" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FFF1B8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E8B84B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silkRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0" />
              <stop offset="35%" stopColor="#E8B84B" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#8A5A12" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E8B84B" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silkWaveBottom" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#8A5A12" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#E8B84B" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFF1B8" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#E8B84B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8A5A12" stopOpacity="0.3" />
            </linearGradient>
            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Ribbon: Loops from behind Align up around sphere to Review */}
          <motion.path
            d="M 120 640 C 200 740, 340 700, 380 500 C 420 320, 260 210, 220 170"
            stroke="url(#silkLeft)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={introStep >= 4 ? { pathLength: 1, opacity: 0.88 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <path
            d="M 140 620 C 220 710, 330 670, 370 510 C 400 350, 270 230, 230 180"
            stroke="#FFF1B8"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            opacity="0.65"
          />

          {/* Right Ribbon: Sweeps from behind Verify around right edge to Govern */}
          <motion.path
            d="M 1420 170 C 1340 230, 1180 330, 1220 520 C 1250 670, 1380 720, 1460 630"
            stroke="url(#silkRight)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={introStep >= 4 ? { pathLength: 1, opacity: 0.88 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.2, ease: 'easeOut' }}
          />
          <path
            d="M 1400 190 C 1320 250, 1200 350, 1230 510 C 1260 640, 1360 690, 1440 610"
            stroke="#FFF1B8"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            opacity="0.65"
          />

          {/* Bottom Sweeping Waves Left & Right */}
          <path
            d="M 0 780 C 250 820, 480 750, 680 770 C 720 775, 760 785, 800 790"
            stroke="url(#silkWaveBottom)"
            strokeWidth="12"
            filter="url(#ribbonGlow)"
            opacity="0.5"
          />
          <path
            d="M 1600 780 C 1350 820, 1120 750, 920 770 C 880 775, 840 785, 800 790"
            stroke="url(#silkWaveBottom)"
            strokeWidth="12"
            filter="url(#ribbonGlow)"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* 6. Centerpiece: Gold V Mark, VERITY (Cinzel) & Tagline */}
      <div 
        className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center text-center pointer-events-none"
        style={{
          transform: `translate3d(calc(-50% + ${mousePos.x * 8}px), calc(-50% + ${mousePos.y * 8}px), 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Soft Gold Flare directly behind V mark */}
        <div className="absolute -top-6 w-36 h-28 bg-[#FFF1B8]/20 blur-2xl rounded-full pointer-events-none" />

        {/* Calligraphic Gold V Mark */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.85 }}
          animate={introStep >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 35, scale: 0.85 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-32 h-22 sm:w-40 sm:h-28 flex items-center justify-center mb-1 drop-shadow-[0_0_35px_rgba(232,184,75,0.95)]"
        >
          <svg viewBox="0 0 260 190" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="heroV1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A5A12"/>
                <stop offset="35%" stopColor="#E8B84B"/>
                <stop offset="60%" stopColor="#FFF1B8"/>
                <stop offset="100%" stopColor="#B9822A"/>
              </linearGradient>
              <linearGradient id="heroV2" x1="0%" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#9A6A1A"/>
                <stop offset="50%" stopColor="#F3CC6B"/>
                <stop offset="100%" stopColor="#FFF6D0"/>
              </linearGradient>
            </defs>

            {/* Left curved wing of the V */}
            <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#heroV1)"/>
            <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#FFF1B8" opacity=".6"/>

            {/* Right upward soaring wing of the V */}
            <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#heroV2)"/>
            <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".38"/>
          </svg>
        </motion.div>

        {/* VERITY Wordmark (Cinzel Roman Capitals) */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={introStep >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="font-cinzel text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF1B8] to-[#E8B84B] uppercase leading-none drop-shadow-[0_4px_30px_rgba(232,184,75,0.7)]"
        >
          VERITY
        </motion.h1>

        {/* BRAND GOVERNANCE Divider Rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={introStep >= 4 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="flex items-center gap-3 sm:gap-6 my-2.5 sm:my-3"
        >
          <div className="w-12 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#E8B84B] to-[#FFF1B8]" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.45em] text-[#FFF1B8] uppercase">
            BRAND GOVERNANCE
          </span>
          <div className="w-12 sm:w-24 h-[1.5px] bg-gradient-to-l from-transparent via-[#E8B84B] to-[#FFF1B8]" />
        </motion.div>

        {/* Tagline Row: Review · Verify · Align · Govern (Cormorant Garamond) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={introStep >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-cormorant text-base sm:text-lg md:text-xl font-medium tracking-wide flex items-center gap-2 sm:gap-3 text-gray-300"
        >
          <span className={`transition-all duration-300 ${activeTaglineIndex === 0 ? 'text-[#FFF1B8] font-bold drop-shadow-[0_0_12px_#E8B84B] scale-105' : 'text-gray-300'}`}>
            Review
          </span>
          <span className="text-[#E8B84B] text-xs">·</span>
          <span className={`transition-all duration-300 ${activeTaglineIndex === 1 ? 'text-[#FFF1B8] font-bold drop-shadow-[0_0_12px_#E8B84B] scale-105' : 'text-gray-300'}`}>
            Verify
          </span>
          <span className="text-[#E8B84B] text-xs">·</span>
          <span className={`transition-all duration-300 ${activeTaglineIndex === 2 ? 'text-[#FFF1B8] font-bold drop-shadow-[0_0_12px_#E8B84B] scale-105' : 'text-gray-300'}`}>
            Align
          </span>
          <span className="text-[#E8B84B] text-xs">·</span>
          <span className={`transition-all duration-300 ${activeTaglineIndex === 3 ? 'text-[#FFF1B8] font-bold drop-shadow-[0_0_12px_#E8B84B] scale-105' : 'text-gray-300'}`}>
            Govern
          </span>
        </motion.div>
      </div>

      {/* 7. Open Illuminated Golden Book & Floating Verified Document */}
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        animate={introStep >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        {/* Floating Document with Gold Orbit Ring and Check Badge */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-2 flex items-center justify-center"
        >
          {/* Thin Gold Elliptical Orbit Ring with Nodes */}
          <div className="absolute w-32 h-14 rounded-[100%] border border-[#E8B84B]/70 -rotate-12 pointer-events-none shadow-[0_0_15px_rgba(232,184,75,0.45)]">
            <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#FFF1B8] shadow-[0_0_6px_#FFF1B8]" />
            <div className="absolute bottom-1 right-3 w-1.5 h-1.5 rounded-full bg-[#E8B84B] shadow-[0_0_6px_#E8B84B]" />
          </div>

          {/* Document Plaque */}
          <div className="relative px-4 py-2.5 rounded-xl bg-[#0D1D4A]/90 border border-[#E8B84B] shadow-[0_0_35px_rgba(232,184,75,0.75)] flex items-center gap-3 backdrop-blur-md">
            <FileText className="w-4 h-4 text-[#FFF1B8]" />
            <div className="space-y-1">
              <div className="w-12 h-1.5 rounded bg-[#FFF1B8]" />
              <div className="w-8 h-1 rounded bg-gray-300" />
            </div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] text-[#071230] flex items-center justify-center shadow-[0_0_10px_#FFF1B8]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </motion.div>

        {/* Upward Light Beam rising from Book Spine */}
        <div className="w-16 h-40 bg-gradient-to-t from-[#FFF1B8]/45 via-[#E8B84B]/20 to-transparent blur-md -mb-6 pointer-events-none" />

        {/* Open Golden Book SVG Base */}
        <div className="relative w-64 sm:w-80 h-16 flex items-center justify-center">
          <svg viewBox="0 0 240 55" className="w-full h-full drop-shadow-[0_0_28px_rgba(232,184,75,0.85)]" fill="none">
            <defs>
              <linearGradient id="bookGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A5A12" />
                <stop offset="35%" stopColor="#E8B84B" />
                <stop offset="65%" stopColor="#FFF1B8" />
                <stop offset="100%" stopColor="#B9822A" />
              </linearGradient>
              <linearGradient id="bookPageLight" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E8B84B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFF1B8" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Left Page Fan */}
            <path d="M 120 44 C 90 40, 45 24, 10 35 C 35 22, 80 16, 120 25 Z" fill="url(#bookGold)" opacity="0.85" />
            <path d="M 120 44 C 90 38, 55 18, 25 26 C 50 14, 90 12, 120 20 Z" fill="url(#bookPageLight)" />
            <path d="M 120 44 C 95 34, 65 14, 40 18 C 65 8, 100 8, 120 15 Z" fill="#FFF1B8" opacity="0.9" />

            {/* Right Page Fan */}
            <path d="M 120 44 C 150 40, 195 24, 230 35 C 205 22, 160 16, 120 25 Z" fill="url(#bookGold)" opacity="0.85" />
            <path d="M 120 44 C 150 38, 185 18, 215 26 C 190 14, 150 12, 120 20 Z" fill="url(#bookPageLight)" />
            <path d="M 120 44 C 145 34, 175 14, 200 18 C 175 8, 140 8, 120 15 Z" fill="#FFF1B8" opacity="0.9" />

            {/* Book Spine Glow Node */}
            <circle cx="120" cy="44" r="5" fill="#FFFFFF" filter="drop-shadow(0 0 12px #FFF1B8)" />
            <circle cx="120" cy="44" r="2.5" fill="#FFF1B8" />
          </svg>
        </div>
      </motion.div>

      {/* 8. The 4 Orbiting 3D Glass Cards (Review, Verify, Align, Govern) */}
      {cardsData.map((card) => {
        const Icon = card.icon;
        const Ghost = card.GhostPanel;
        const isTaglineActive = activeTaglineIndex === card.index;
        const isHovered = hoveredCard === card.id;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 120, scale: 0.8 }}
            animate={introStep >= 4 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 120, scale: 0.8 }}
            transition={{
              duration: 0.9,
              delay: 0.15 * card.index,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute z-30"
            style={{
              ...card.posStyle,
              transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            {/* Dedicated Ghost Wireframe Backdrop */}
            <Ghost />

            {/* Main Interactive Glass Card with 3D Tilt */}
            <motion.div
              animate={{
                y: isTaglineActive ? [-6, -10, -6] : [-4, 4, -4],
              }}
              transition={{
                duration: 6 + card.index * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{
                scale: 1.08,
                y: -8,
                transition: { duration: 0.25 },
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActivePage('dashboard')}
              className={`w-38 sm:w-46 p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer select-none ${
                isTaglineActive || isHovered
                  ? 'bg-gradient-to-br from-[#0D1D4A]/95 to-[#071230]/95 border-[#FFF1B8] shadow-[0_0_35px_rgba(232,184,75,0.7)] ring-1 ring-[#FFF1B8]'
                  : 'bg-gradient-to-br from-[#0D1D4A]/70 via-[#071230]/85 to-[#040A1C]/90 border-[#E8B84B]/60 shadow-[0_15px_30px_rgba(0,0,0,0.75)] hover:border-[#FFF1B8]'
              }`}
              style={{
                transform: isHovered ? 'perspective(900px) rotateY(0deg) rotateX(0deg)' : card.tilt,
                boxShadow: isTaglineActive || isHovered
                  ? '0 20px 40px rgba(0,0,0,0.8), 0 0 35px rgba(232,184,75,0.65)'
                  : '0 12px 25px rgba(0,0,0,0.6), 0 0 18px rgba(232,184,75,0.25)',
              }}
            >
              {/* Top-left glass specular highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl pointer-events-none" />

              {/* Rounded Glass Square Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D1D4A] to-[#071230] border border-[#E8B84B] flex items-center justify-center text-[#FFF1B8] mb-2.5 shadow-[0_0_12px_rgba(232,184,75,0.45)]">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-sans font-bold text-sm sm:text-base text-white tracking-tight">
                {card.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/80 font-sans mt-0.5 leading-snug">
                {card.subtitle}
              </p>

              {/* Hover Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2.5 pt-2 border-t border-[#E8B84B]/40 text-[10px] text-[#FFF1B8] font-mono leading-tight"
                >
                  {card.tooltip}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* 9. Bottom Action CTAs (Fade in during final phase of intro) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={introStep >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-5 sm:bottom-7 left-8 sm:left-12 z-30 flex items-center gap-3"
      >
        {/* Primary CTA: Explore Demo Workspace (No signup needed) */}
        <button
          type="button"
          onClick={() => setActivePage('dashboard')}
          className="btn-gold-sweep px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8B84B] via-[#FFF1B8] to-[#E8B84B] hover:brightness-110 text-[#071230] font-bold shadow-glow text-xs uppercase tracking-wide flex items-center gap-2 transition-all active:scale-95"
        >
          <span>Explore Demo Workspace</span>
          <ArrowRight className="w-4 h-4 text-[#071230]" />
        </button>

        {/* Secondary CTA: Start Reviewing Content */}
        <button
          type="button"
          onClick={() => setActivePage('new-review')}
          className="px-4 py-2.5 rounded-xl bg-[#0D1D4A]/80 hover:bg-[#0D1D4A] text-[#FFF1B8] border border-[#E8B84B]/60 font-semibold text-xs transition-all active:scale-95"
        >
          Start Reviewing
        </button>
      </motion.div>

      {/* 10. Skip Intro Button (Appears at bottom right after 0.6s if intro is playing) */}
      {!introFinished && introStep < 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          onClick={skipIntro}
          className="absolute bottom-6 right-8 z-40 px-3 py-1.5 rounded-full bg-[#0D1D4A]/80 border border-[#E8B84B]/50 text-xs font-mono text-[#FFF1B8] hover:bg-[#E8B84B] hover:text-[#071230] transition-colors flex items-center gap-1.5 backdrop-blur-md"
        >
          <span>Skip Intro</span>
          <span className="text-[9px] opacity-75 font-sans">(Esc)</span>
        </motion.button>
      )}
    </div>
  );
}
