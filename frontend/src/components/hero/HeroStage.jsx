import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, Layers, TrendingUp, CheckCircle, 
  FileText, Check, Sparkles, ArrowRight, ChevronRight, X
} from 'lucide-react';

import { DottedGlobeCanvas } from './DottedGlobeCanvas';
import { RisingRingsLayer } from './RisingRingsLayer';

/**
 * 4 Dedicated Holographic Ghost Backdrops
 */
function GhostDocPanel() {
  return (
    <div 
      className="absolute -top-3 -left-6 w-36 sm:w-44 p-3 rounded-2xl border border-[#D4AF37]/30 bg-[#060B1F]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_20px_rgba(212,175,55,0.2)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(18deg) rotateX(12deg) rotateZ(-5deg)',
      }}
    >
      <div className="flex items-center justify-between mb-2 opacity-70">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <div className="w-12 h-1.5 rounded bg-[#D4AF37]/60" />
        </div>
        <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37]/70" />
      </div>
      <div className="space-y-1.5 opacity-50">
        <div className="w-full h-1 rounded bg-[#F3D98B]/80" />
        <div className="w-4/5 h-1 rounded bg-[#F3D98B]/60" />
        <div className="w-full h-1 rounded bg-[#F3D98B]/80" />
      </div>
    </div>
  );
}

function GhostChecklistPanel() {
  return (
    <div 
      className="absolute -top-3 -right-6 w-36 sm:w-44 p-3 rounded-2xl border border-[#D4AF37]/30 bg-[#060B1F]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_20px_rgba(212,175,55,0.2)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(-18deg) rotateX(12deg) rotateZ(5deg)',
      }}
    >
      <div className="flex items-center justify-between mb-2 opacity-70">
        <div className="w-14 h-1.5 rounded bg-[#D4AF37]/70" />
        <div className="w-2.5 h-2.5 rounded-full border border-[#D4AF37] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#F3D98B]" />
        </div>
      </div>
      <div className="space-y-2 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm border border-[#F3D98B]/70" />
            <div className="w-3/4 h-1 rounded bg-[#F3D98B]/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

function GhostStackPanel() {
  return (
    <div 
      className="absolute -top-5 -left-6 w-36 sm:w-44 h-24 pointer-events-none -z-10 flex flex-col justify-center items-center opacity-80 hidden sm:flex"
      style={{
        transform: 'perspective(850px) rotateY(22deg) rotateX(-6deg) rotateZ(-10deg)',
      }}
    >
      <div className="w-28 h-9 rounded-lg border border-[#D4AF37]/40 bg-[#060B1F]/40 -mb-6 shadow-[0_0_12px_rgba(212,175,55,0.25)] transform -rotate-6" />
      <div className="w-32 h-10 rounded-lg border border-[#F3D98B]/50 bg-[#111B3D]/50 -mb-6 shadow-[0_0_15px_rgba(212,175,55,0.3)] transform -rotate-3" />
      <div className="w-36 h-11 rounded-lg border border-[#D4AF37]/60 bg-[#060B1F]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)]" />
    </div>
  );
}

function GhostChartPanel() {
  return (
    <div 
      className="absolute -top-3 -right-6 w-36 sm:w-44 p-3 rounded-2xl border border-[#D4AF37]/30 bg-[#060B1F]/60 backdrop-blur-md pointer-events-none -z-10 shadow-[0_0_20px_rgba(212,175,55,0.2)] hidden sm:block"
      style={{
        transform: 'perspective(900px) rotateY(-18deg) rotateX(-6deg) rotateZ(4deg)',
      }}
    >
      <div className="w-14 h-1.5 rounded bg-[#D4AF37]/70 mb-3 opacity-70" />
      <div className="flex items-end justify-between h-10 px-1 opacity-60">
        <div className="w-2.5 h-3 rounded-t bg-[#D4AF37]/50" />
        <div className="w-2.5 h-5 rounded-t bg-[#D4AF37]/70" />
        <div className="w-2.5 h-7 rounded-t bg-[#F3D98B]/80" />
        <div className="w-2.5 h-9 rounded-t bg-[#F3D98B]" />
        <div className="w-2.5 h-10 rounded-t bg-gradient-to-t from-[#D4AF37] to-[#F3D98B] shadow-[0_0_8px_#F3D98B]" />
      </div>
    </div>
  );
}

/**
 * Centered Single-Screen Hero
 * - Fills min-height calc(100vh - 4rem)
 * - Single centered group element sized with clamp() and aspect-square so globe, circle, text and book are strictly concentric and never overlap
 * - Floating side cards positioned relative to this centered group (hidden on mobile & tablet)
 * - Max-width 1280px, zero horizontal scroll at any screen size
 */
export function HeroStage({ setActivePage }) {
  const prefersReduced = useReducedMotion();

  const [introFinished, setIntroFinished] = useState(() => {
    try {
      return prefersReduced || sessionStorage.getItem('verity_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [introStep, setIntroStep] = useState(introFinished ? 5 : 0);
  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Mouse Parallax Offsets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (prefersReduced || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: nx, y: ny });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Intro Sequence Timeline
  useEffect(() => {
    if (introFinished) return;

    const t1 = setTimeout(() => setIntroStep(1), 350);
    const t2 = setTimeout(() => setIntroStep(2), 900);
    const t3 = setTimeout(() => setIntroStep(3), 1500);
    const t4 = setTimeout(() => setIntroStep(4), 2100);
    const t5 = setTimeout(() => {
      setIntroStep(5);
      setIntroFinished(true);
      try {
        sessionStorage.setItem('verity_intro_seen', 'true');
      } catch (e) {}
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [introFinished]);

  // Keyboard skip
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

  // Tagline cycle
  useEffect(() => {
    if (introStep < 5) return;
    const interval = setInterval(() => {
      setActiveTaglineIndex((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [introStep]);

  // 4 Relative Side Cards
  const cardsData = [
    {
      id: 'review',
      index: 0,
      title: 'Review',
      subtitle: 'Analyse your content',
      icon: FileSearch,
      tooltip: 'Deep syntax, terminology & claim screening on draft copy',
      posClass: '-left-[50%] xl:-left-[52%] top-[8%]',
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
      posClass: '-right-[50%] xl:-right-[52%] top-[8%]',
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
      posClass: '-left-[50%] xl:-left-[52%] top-[54%]',
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
      posClass: '-right-[50%] xl:-right-[52%] top-[54%]',
      tilt: 'perspective(900px) rotateY(-14deg) rotateX(-4deg) rotateZ(2deg)',
      GhostPanel: GhostChartPanel,
    },
  ];

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[calc(100vh-4rem)] max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col justify-center items-center overflow-x-hidden select-none py-6"
    >
      {/* 1. Deep Navy Vignette & Ambient Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background: 'radial-gradient(circle at 50% 46%, #0A1230 0%, #060B1F 70%)',
          transform: `translate3d(${mousePos.x * 5}px, ${mousePos.y * 5}px, 0)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(320px,60vw,650px)] h-[clamp(320px,60vw,650px)] bg-gradient-radial from-[#F3D98B]/18 via-[#D4AF37]/8 to-transparent blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* 2. Rising Rings Layer */}
      <RisingRingsLayer />

      {/* =========================================================================
          3. THE MASTER GROUPED ELEMENT (Sized with clamp() & aspect-square)
          The globe, glow ring, V logo, wordmark, book and document are inside here!
          This guarantees they are ALWAYS concentric and never crop or drift.
          ========================================================================= */}
      <div className="relative w-[clamp(300px,46vw,510px)] aspect-square flex items-center justify-center pointer-events-none mt-2">

        {/* Concentric Fibonacci Dotted Globe */}
        <DottedGlobeCanvas active={introStep >= 2} progress={introStep >= 2 ? 1 : 0} />

        {/* Concentric Golden Outer Ring & Halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={introStep >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-[1.5px] border-[#D4AF37]/65 pointer-events-none shadow-[0_0_35px_rgba(212,175,55,0.45),inset_0_0_30px_rgba(212,175,55,0.25)] flex items-center justify-center z-10"
        >
          {/* Top Corona Flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-5 bg-gradient-to-r from-transparent via-[#F3D98B] to-transparent blur-[2px] opacity-80" />

          {/* Oblique Concentric Elliptical Orbital Ring across sphere */}
          <div className="absolute w-[124%] h-[40%] rounded-[100%] border border-[#D4AF37]/35 -rotate-[15deg] pointer-events-none shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <div className="absolute left-[15%] top-0 w-2 h-2 rounded-full bg-[#F3D98B] shadow-[0_0_8px_#F3D98B]" />
            <div className="absolute right-[20%] bottom-0 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
          </div>
        </motion.div>

        {/* Centerpiece: V Monogram, VERITY Wordmark, Subtitle, and Cycling Tagline */}
        <div 
          className="absolute inset-x-0 top-[32%] -translate-y-1/2 z-20 flex flex-col items-center text-center pointer-events-none px-2"
          style={{
            transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          {/* Soft Gold Glow behind V */}
          <div className="absolute -top-3 w-24 h-16 bg-[#F3D98B]/20 blur-xl rounded-full pointer-events-none" />

          {/* Calligraphic Gold V Mark */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.85 }}
            animate={introStep >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 25, scale: 0.85 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-20 h-14 sm:w-24 sm:h-18 flex items-center justify-center mb-0.5 drop-shadow-[0_0_25px_rgba(212,175,55,0.85)]"
          >
            <svg viewBox="0 0 260 190" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id="heroCenterV1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A5A12"/>
                  <stop offset="35%" stopColor="#D4AF37"/>
                  <stop offset="60%" stopColor="#F3D98B"/>
                  <stop offset="100%" stopColor="#B9822A"/>
                </linearGradient>
                <linearGradient id="heroCenterV2" x1="0%" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9A6A1A"/>
                  <stop offset="50%" stopColor="#F3CC6B"/>
                  <stop offset="100%" stopColor="#FFF6D0"/>
                </linearGradient>
              </defs>
              <path d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" fill="url(#heroCenterV1)"/>
              <path d="M30 52 C56 46 84 62 104 100 C78 82 52 66 30 52 Z" fill="#F3D98B" opacity=".6"/>
              <path d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" fill="url(#heroCenterV2)"/>
              <path d="M138 140 C150 96 178 52 228 20 C190 58 168 100 152 146 Z" fill="#FFFFFF" opacity=".38"/>
            </svg>
          </motion.div>

          {/* VERITY Wordmark (Cinzel Roman Serif) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={introStep >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#F3D98B] to-[#D4AF37] uppercase leading-none drop-shadow-[0_4px_25px_rgba(212,175,55,0.65)]"
          >
            VERITY
          </motion.h1>

          {/* BRAND GOVERNANCE Rule */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={introStep >= 4 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-2.5 sm:gap-3.5 my-1.5"
          >
            <div className="w-8 sm:w-14 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F3D98B]" />
            <span className="text-[8px] sm:text-[9.5px] font-mono font-bold tracking-[0.45em] text-[#F3D98B] uppercase">
              BRAND GOVERNANCE
            </span>
            <div className="w-8 sm:w-14 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#F3D98B]" />
          </motion.div>

          {/* Tagline Row: Review · Verify · Align · Govern */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={introStep >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-cormorant text-xs sm:text-sm md:text-base font-medium tracking-wide flex items-center gap-1.5 sm:gap-2 text-[#F5F1E6]/80 mt-0.5"
          >
            <span className={`transition-all duration-300 ${activeTaglineIndex === 0 ? 'text-[#F3D98B] font-bold drop-shadow-[0_0_10px_#D4AF37] scale-105' : 'text-[#F5F1E6]/70'}`}>
              Review
            </span>
            <span className="text-[#D4AF37] text-[10px]">·</span>
            <span className={`transition-all duration-300 ${activeTaglineIndex === 1 ? 'text-[#F3D98B] font-bold drop-shadow-[0_0_10px_#D4AF37] scale-105' : 'text-[#F5F1E6]/70'}`}>
              Verify
            </span>
            <span className="text-[#D4AF37] text-[10px]">·</span>
            <span className={`transition-all duration-300 ${activeTaglineIndex === 2 ? 'text-[#F3D98B] font-bold drop-shadow-[0_0_10px_#D4AF37] scale-105' : 'text-[#F5F1E6]/70'}`}>
              Align
            </span>
            <span className="text-[#D4AF37] text-[10px]">·</span>
            <span className={`transition-all duration-300 ${activeTaglineIndex === 3 ? 'text-[#F3D98B] font-bold drop-shadow-[0_0_10px_#D4AF37] scale-105' : 'text-[#F5F1E6]/70'}`}>
              Govern
            </span>
          </motion.div>
        </div>

        {/* Anchored Open Glowing Codex & Floating Document (Placed at Bottom 22% & 5%, cleanly below text) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={introStep >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none w-full"
        >
          {/* Floating Document with Gold Orbit Ring and Check Badge */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-1 flex items-center justify-center"
          >
            {/* Elliptical Orbit Ring */}
            <div className="absolute w-28 h-10 rounded-[100%] border border-[#D4AF37]/65 -rotate-12 pointer-events-none shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <div className="absolute top-0.5 left-2 w-1.5 h-1.5 rounded-full bg-[#F3D98B] shadow-[0_0_6px_#F3D98B]" />
              <div className="absolute bottom-0.5 right-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            </div>

            {/* Document Plaque */}
            <div className="relative px-3 py-1.5 rounded-xl bg-[#0A1230]/95 border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.65)] flex items-center gap-2 backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-[#F3D98B]" />
              <div className="space-y-0.5">
                <div className="w-8 h-1 rounded bg-[#F3D98B]" />
                <div className="w-5 h-0.5 rounded bg-gray-400" />
              </div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] text-[#060B1F] flex items-center justify-center shadow-[0_0_8px_#F3D98B]">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
          </motion.div>

          {/* Upward Light Beam */}
          <div className="w-10 h-8 bg-gradient-to-t from-[#F3D98B]/35 via-[#D4AF37]/15 to-transparent blur-md -mb-2 pointer-events-none" />

          {/* Open Golden Book Base */}
          <div className="relative w-44 sm:w-52 h-10 flex items-center justify-center">
            <svg viewBox="0 0 240 55" className="w-full h-full drop-shadow-[0_0_24px_rgba(212,175,55,0.8)]" fill="none">
              <defs>
                <linearGradient id="bookGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A5A12" />
                  <stop offset="35%" stopColor="#D4AF37" />
                  <stop offset="65%" stopColor="#F3D98B" />
                  <stop offset="100%" stopColor="#B9822A" />
                </linearGradient>
                <linearGradient id="bookPageLightGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F3D98B" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Left Fan */}
              <path d="M 120 44 C 90 40, 45 24, 10 35 C 35 22, 80 16, 120 25 Z" fill="url(#bookGoldGrad)" opacity="0.85" />
              <path d="M 120 44 C 90 38, 55 18, 25 26 C 50 14, 90 12, 120 20 Z" fill="url(#bookPageLightGrad)" />
              <path d="M 120 44 C 95 34, 65 14, 40 18 C 65 8, 100 8, 120 15 Z" fill="#F3D98B" opacity="0.9" />

              {/* Right Fan */}
              <path d="M 120 44 C 150 40, 195 24, 230 35 C 205 22, 160 16, 120 25 Z" fill="url(#bookGoldGrad)" opacity="0.85" />
              <path d="M 120 44 C 150 38, 185 18, 215 26 C 190 14, 150 12, 120 20 Z" fill="url(#bookPageLightGrad)" />
              <path d="M 120 44 C 145 34, 175 14, 200 18 C 175 8, 140 8, 120 15 Z" fill="#F3D98B" opacity="0.9" />

              {/* Book Spine Glow Node */}
              <circle cx="120" cy="44" r="3.5" fill="#FFFFFF" filter="drop-shadow(0 0 10px #F3D98B)" />
            </svg>
          </div>
        </motion.div>

        {/* =========================================================================
            4. FLOATING SIDE CARDS (Positioned RELATIVE to this exact central group)
            Hidden on mobile & tablet (hidden lg:block) so zero horizontal overflow!
            ========================================================================= */}
        {cardsData.map((card) => {
          const Icon = card.icon;
          const Ghost = card.GhostPanel;
          const isTaglineActive = activeTaglineIndex === card.index;
          const isHovered = hoveredCard === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={introStep >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{
                duration: 0.8,
                delay: 0.12 * card.index,
                ease: 'easeOut',
              }}
              className={`absolute z-30 ${card.posClass} hidden lg:block pointer-events-auto`}
              style={{
                transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <Ghost />

              {/* Main Card with 3D Tilt & Gentle Float */}
              <motion.div
                animate={{
                  y: isTaglineActive ? [-6, -10, -6] : [-3, 3, -3],
                }}
                transition={{
                  duration: 6 + card.index * 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.06,
                  y: -6,
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActivePage('dashboard')}
                className={`w-38 xl:w-42 p-3.5 xl:p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer select-none ${
                  isTaglineActive || isHovered
                    ? 'bg-gradient-to-br from-[#111B3D]/95 to-[#0A1230]/95 border-[#F3D98B] shadow-[0_0_30px_rgba(212,175,55,0.65)] ring-1 ring-[#F3D98B]'
                    : 'bg-gradient-to-br from-[#111B3D]/75 via-[#0A1230]/85 to-[#060B1F]/90 border-[#D4AF37]/50 shadow-[0_15px_30px_rgba(0,0,0,0.7)] hover:border-[#F3D98B]'
                }`}
                style={{
                  transform: isHovered ? 'perspective(900px) rotateY(0deg) rotateX(0deg)' : card.tilt,
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#111B3D] to-[#0A1230] border border-[#D4AF37] flex items-center justify-center text-[#F3D98B] mb-2 shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                <h3 className="font-sans font-bold text-sm text-white tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] text-[#9AA6C7] font-sans mt-0.5 leading-snug">
                  {card.subtitle}
                </p>

                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 pt-2 border-t border-[#D4AF37]/35 text-[9px] text-[#F3D98B] font-mono leading-tight"
                  >
                    {card.tooltip}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}

      </div>

      {/* 5. Bottom Action CTAs (Centered, zero overflow) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={introStep >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 z-30 pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setActivePage('dashboard')}
          className="btn-gold-sweep w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3D98B] to-[#D4AF37] hover:brightness-110 text-[#060B1F] font-bold shadow-glow text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>Explore Demo Workspace</span>
          <ArrowRight className="w-4 h-4 text-[#060B1F]" />
        </button>

        <button
          type="button"
          onClick={() => setActivePage('new-review')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#111B3D]/80 hover:bg-[#111B3D] text-[#F3D98B] border border-[#D4AF37]/60 font-semibold text-xs transition-all active:scale-95 text-center"
        >
          Start Reviewing
        </button>
      </motion.div>

      {/* 6. Skip Intro Control */}
      {!introFinished && introStep < 5 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          onClick={skipIntro}
          className="absolute bottom-4 right-4 sm:right-6 z-40 px-3 py-1.5 rounded-full bg-[#111B3D]/80 border border-[#D4AF37]/45 text-xs font-mono text-[#F3D98B] hover:bg-[#D4AF37] hover:text-[#060B1F] transition-colors flex items-center gap-1.5 backdrop-blur-md"
        >
          <span>Skip</span>
          <span className="text-[9px] opacity-75">(Esc)</span>
        </motion.button>
      )}
    </div>
  );
}
