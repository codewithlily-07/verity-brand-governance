import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, ShieldCheck, Layers, TrendingUp, CheckCircle, 
  FileText, Check, Sparkles, Zap, Lock, BookOpen, ChevronRight
} from 'lucide-react';

/**
 * Exact cinematic visual matching the reference design:
 * - Central glowing golden sphere with orbital rings
 * - Stylized Golden Winged "V" VERITY crest
 * - "VERITY — BRAND GOVERNANCE"
 * - Subtitle: "Review · Verify · Align · Govern"
 * - Open illuminated golden codex with upward light beam at bottom
 * - Floating verified document with golden checkmark seal
 * - 4 Glassmorphic orbiting HUD cards:
 *     1. Review (Analyse your content)
 *     2. Verify (Check facts & claims)
 *     3. Align (Keep it on brand)
 *     4. Govern (Ensure safe publishing)
 * - Flowing golden energy ribbons and floating HUD background panels
 * - Upward staggered entrance animation (rising from below)
 */
export function VerityCinematicVisual({ onSelectMode }) {
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      id: 'review',
      title: 'Review',
      desc: 'Analyse your content',
      icon: FileSearch,
      position: 'top-left',
      colClasses: 'top-[8%] left-[2%] sm:left-[6%]',
      badge: '3-Layer AST Scan',
      details: 'Deep syntax and semantics scanning against enterprise brand policy.',
    },
    {
      id: 'verify',
      title: 'Verify',
      desc: 'Check facts & claims',
      icon: ShieldCheck,
      position: 'top-right',
      colClasses: 'top-[8%] right-[2%] sm:right-[6%]',
      badge: 'Zero Hallucination',
      details: 'Grounds every numerical and factual claim in verified knowledge vaults.',
    },
    {
      id: 'align',
      title: 'Align',
      desc: 'Keep it on brand',
      icon: Layers,
      position: 'bottom-left',
      colClasses: 'bottom-[12%] left-[2%] sm:left-[6%]',
      badge: 'Voice & Tone',
      details: 'Enforces canonical terminology, tone guidelines, and stylistic rules.',
    },
    {
      id: 'govern',
      title: 'Govern',
      desc: 'Ensure safe publishing',
      icon: TrendingUp,
      position: 'bottom-right',
      colClasses: 'bottom-[12%] right-[2%] sm:right-[6%]',
      badge: 'SHA-256 Sign-off',
      details: 'Version-locked approvals, immutable audit history, and team compliance.',
    },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#070C1A] via-[#0B1428] to-[#060A16] border border-[#C6A15B]/30 shadow-[0_25px_70px_rgba(0,0,0,0.9)]">
      
      {/* Background Radial Core Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(198,161,91,0.18)_0%,rgba(11,20,40,0.4)_50%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A15B]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* ==================================================
          1. FLOWING GOLDEN ENERGY RIBBONS & ORBITS (SVG)
          ================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1000 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D1" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#C6A15B" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#8C6A23" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0" />
            <stop offset="50%" stopColor="#E6C77B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="sphereCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#C6A15B" stopOpacity="0.15" />
            <stop offset="85%" stopColor="#0B1428" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#070C1A" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Central Luminous Sphere Outline */}
        <circle cx="500" cy="270" r="160" fill="url(#sphereCore)" stroke="#C6A15B" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="500" cy="270" r="156" stroke="#E6C77B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.5" />

        {/* Large Elliptical Golden Energy Rings */}
        <motion.ellipse
          cx="500"
          cy="270"
          rx="250"
          ry="75"
          stroke="url(#orbitGrad)"
          strokeWidth="2"
          transform="rotate(-18 500 270)"
          initial={{ rotate: -18 }}
          animate={{ rotate: [-18, -14, -18] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="500"
          cy="270"
          rx="270"
          ry="65"
          stroke="url(#orbitGrad)"
          strokeWidth="1.2"
          strokeDasharray="8 6"
          transform="rotate(22 500 270)"
          initial={{ rotate: 22 }}
          animate={{ rotate: [22, 26, 22] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dynamic Sweeping Golden Ribbon Curves (Bottom Wave) */}
        <motion.path
          d="M 50 560 C 250 580, 350 490, 500 520 C 650 550, 750 590, 950 560"
          stroke="url(#goldRibbonGrad)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <path
          d="M 120 580 C 300 540, 420 510, 500 525 C 600 540, 700 600, 880 575"
          stroke="#C6A15B"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Upward Light Blossoms radiating from Open Book at (500, 500) */}
        <g opacity="0.6">
          <line x1="500" y1="490" x2="440" y2="400" stroke="#E6C77B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="500" y1="490" x2="470" y2="380" stroke="#FFF2D1" strokeWidth="1.5" />
          <line x1="500" y1="490" x2="500" y2="360" stroke="#FFF2D1" strokeWidth="2" />
          <line x1="500" y1="490" x2="530" y2="380" stroke="#FFF2D1" strokeWidth="1.5" />
          <line x1="500" y1="490" x2="560" y2="400" stroke="#E6C77B" strokeWidth="1" strokeDasharray="3 3" />
        </g>
      </svg>

      {/* ==================================================
          2. BACKGROUND HOLOGRAPHIC HUD PREVIEWS
          ================================================== */}
      {/* Top Left: Document Wireframe HUD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 1.0, delay: 0.2 }}
        className="absolute top-[4%] left-[1%] sm:left-[2%] w-24 sm:w-28 h-32 rounded-xl border border-[#C6A15B]/30 bg-[#101B35]/40 p-2.5 space-y-1.5 pointer-events-none hidden md:block"
      >
        <div className="w-8 h-1.5 rounded bg-[#C6A15B]/60 mb-2" />
        <div className="w-full h-1 rounded bg-gray-500/40" />
        <div className="w-5/6 h-1 rounded bg-gray-500/40" />
        <div className="w-4/6 h-1 rounded bg-gray-500/40" />
        <div className="w-full h-1 rounded bg-gray-500/40 mt-3" />
        <div className="w-3/4 h-1 rounded bg-[#C6A15B]/40" />
      </motion.div>

      {/* Top Right: Checklist & Analytics HUD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 1.0, delay: 0.25 }}
        className="absolute top-[4%] right-[1%] sm:right-[2%] w-24 sm:w-28 h-32 rounded-xl border border-[#C6A15B]/30 bg-[#101B35]/40 p-2.5 space-y-2 pointer-events-none hidden md:block"
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal" />
          <div className="w-12 h-1 rounded bg-gray-400/50" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#C6A15B]" />
          <div className="w-10 h-1 rounded bg-gray-400/50" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-sky" />
          <div className="w-8 h-1 rounded bg-gray-400/50" />
        </div>
        {/* Mini Bar Chart */}
        <div className="pt-2 flex items-end gap-1.5 h-10">
          <div className="w-2.5 h-4 bg-[#C6A15B]/50 rounded-t-sm" />
          <div className="w-2.5 h-6 bg-[#C6A15B]/70 rounded-t-sm" />
          <div className="w-2.5 h-8 bg-[#C6A15B] rounded-t-sm" />
          <div className="w-2.5 h-5 bg-[#C6A15B]/60 rounded-t-sm" />
        </div>
      </motion.div>

      {/* ==================================================
          3. CENTERPIECE: GOLDEN WINGED "V" CREST & WORDMARK
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center text-center -translate-y-8 sm:-translate-y-6"
      >
        {/* Dynamic Stylized Winged Golden "V" SVG Logo */}
        <div className="relative w-28 h-20 sm:w-36 sm:h-24 flex items-center justify-center mb-1">
          <svg viewBox="0 0 140 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(230,199,123,0.7)]" fill="none">
            <defs>
              <linearGradient id="wingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFF2D1" />
                <stop offset="65%" stopColor="#C6A15B" />
                <stop offset="100%" stopColor="#8C6A23" />
              </linearGradient>
            </defs>

            {/* Left Wing / Stroke of the V */}
            <motion.path
              d="M 30 20 C 45 42, 60 70, 70 82 C 64 65, 52 42, 42 28 C 38 23, 34 21, 30 20 Z"
              fill="url(#wingGold)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            />

            {/* Right Wing / Soaring Upward Stroke of the V */}
            <motion.path
              d="M 70 82 C 78 68, 92 40, 115 15 C 104 28, 86 52, 74 68 C 72 71, 70 78, 70 82 Z"
              fill="url(#wingGold)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
            />

            {/* Accent Feather Flight Line */}
            <motion.path
              d="M 50 35 C 70 55, 88 40, 110 20"
              stroke="#FFF2D1"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* VERITY Main Wordmark */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF2D1] to-[#C6A15B] uppercase leading-tight drop-shadow-[0_2px_15px_rgba(198,161,91,0.5)]">
          VERITY
        </h2>

        {/* Subtitle Rule: — BRAND GOVERNANCE — */}
        <div className="flex items-center gap-3 sm:gap-4 my-2">
          <div className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent to-[#C6A15B]" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] text-[#E6C77B] uppercase">
            BRAND GOVERNANCE
          </span>
          <div className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent to-[#C6A15B]" />
        </div>

        {/* 4 Pillars Mantra: Review · Verify · Align · Govern */}
        <div className="text-xs sm:text-sm font-sans tracking-wide text-gray-300 font-medium flex items-center gap-2 sm:gap-3">
          <span className="text-white hover:text-[#E6C77B] transition-colors">Review</span>
          <span className="text-[#C6A15B] text-xs">·</span>
          <span className="text-white hover:text-[#E6C77B] transition-colors">Verify</span>
          <span className="text-[#C6A15B] text-xs">·</span>
          <span className="text-white hover:text-[#E6C77B] transition-colors">Align</span>
          <span className="text-[#C6A15B] text-xs">·</span>
          <span className="text-white hover:text-[#E6C77B] transition-colors">Govern</span>
        </div>
      </motion.div>

      {/* ==================================================
          4. BOTTOM CODEX: OPEN GOLDEN BOOK & VERIFIED DOCUMENT
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.35, ease: 'easeOut' }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        {/* Floating Illuminated Document with Check Seal */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-2 flex items-center justify-center"
        >
          {/* Orbital Ring Around Floating Doc */}
          <div className="absolute w-24 h-12 rounded-full border border-[#C6A15B]/60 -rotate-12 pointer-events-none" />

          {/* Document Mini-Card with Gold Glow */}
          <div className="relative px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#18285A]/90 to-[#0B1428]/95 border border-[#C6A15B] shadow-[0_0_25px_rgba(198,161,91,0.6)] flex items-center gap-2 backdrop-blur-md">
            <FileText className="w-4 h-4 text-[#FFF2D1]" />
            <div className="space-y-0.5">
              <div className="w-10 h-1 rounded bg-[#E6C77B]" />
              <div className="w-7 h-1 rounded bg-gray-400" />
            </div>
            <div className="w-5 h-5 rounded-full bg-[#C6A15B] text-[#101B35] flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </motion.div>

        {/* Open Golden Book SVG Base */}
        <div className="relative w-48 sm:w-64 h-14 flex items-center justify-center">
          <svg viewBox="0 0 200 45" className="w-full h-full drop-shadow-[0_0_15px_rgba(230,199,123,0.5)]" fill="none">
            {/* Left Page Fan */}
            <path
              d="M 100 35 C 75 32, 40 22, 10 28 C 30 18, 65 14, 100 20 Z"
              fill="url(#wingGold)"
              opacity="0.85"
            />
            <path
              d="M 100 35 C 75 30, 45 18, 20 22 C 40 12, 70 10, 100 15 Z"
              fill="#FFF2D1"
              opacity="0.95"
            />

            {/* Right Page Fan */}
            <path
              d="M 100 35 C 125 32, 160 22, 190 28 C 170 18, 135 14, 100 20 Z"
              fill="url(#wingGold)"
              opacity="0.85"
            />
            <path
              d="M 100 35 C 125 30, 155 18, 180 22 C 160 12, 130 10, 100 15 Z"
              fill="#FFF2D1"
              opacity="0.95"
            />

            {/* Book Spine Node */}
            <circle cx="100" cy="35" r="3" fill="#FFF2D1" />
          </svg>
        </div>
      </motion.div>

      {/* ==================================================
          5. THE 4 ORBITING GLASSMORPHIC HUD CARDS
          ================================================== */}
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isHovered = activeCard === card.id;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + idx * 0.15, ease: 'easeOut' }}
            className={`absolute ${card.colClasses} z-30`}
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              animate={{ y: [-3, 3, -3] }}
              transition={{
                y: { duration: 4 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => onSelectMode && onSelectMode(card.id)}
              className={`w-36 sm:w-44 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                isHovered
                  ? 'bg-[#18285A]/90 border-[#FFF2D1] shadow-[0_0_30px_rgba(230,199,123,0.5)] ring-1 ring-[#FFF2D1]'
                  : 'bg-[#101B35]/80 border-[#C6A15B]/50 shadow-xl hover:border-[#C6A15B]'
              }`}
              style={{
                boxShadow: isHovered
                  ? '0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(198,161,91,0.45)'
                  : '0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(198,161,91,0.15)',
              }}
            >
              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18285A] to-[#0B1428] border border-[#C6A15B]/60 flex items-center justify-center text-[#E6C77B] mb-2.5 shadow-md">
                <Icon className="w-5 h-5" />
              </div>

              {/* Title & Subtitle */}
              <h4 className="font-serif font-bold text-sm sm:text-base text-white tracking-tight">
                {card.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-300 font-sans mt-0.5 leading-snug">
                {card.desc}
              </p>

              {/* Hover Badge Expansion */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 pt-2 border-t border-[#C6A15B]/30 text-[10px] text-[#E6C77B] font-mono"
                >
                  {card.badge}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}

    </div>
  );
}

