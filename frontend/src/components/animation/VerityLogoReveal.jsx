import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scene 1: Brand Formation SVG Emblem Reveal
 * Features dynamic stroke drawing of the Verity shield and faceted V-check crest,
 * followed by a luminous gold light sweep and radiant pulse.
 */
export function VerityLogoReveal({ visible = true, progress = 1 }) {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Ambient Radial Core Glow */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-gold/20 blur-2xl pointer-events-none"
        animate={{
          scale: visible ? [0.8, 1.2, 1] : 0.5,
          opacity: visible ? [0.2, 0.7, 0.5] : 0,
        }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(200,163,90,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5ECD2" />
              <stop offset="50%" stopColor="#C8A35A" />
              <stop offset="100%" stopColor="#96742E" />
            </linearGradient>

            <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18285A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0A1128" stopOpacity="0.95" />
            </linearGradient>

            {/* Sweep Mask for the light shine effect */}
            <linearGradient id="lightSweep" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <clipPath id="shieldClip">
              <path d="M60 10 L102 26 V62 C102 88 60 110 60 110 C60 110 18 88 18 62 V26 L60 10 Z" />
            </clipPath>
          </defs>

          {/* Shield Outer Outline Drawing */}
          <motion.path
            d="M60 10 L102 26 V62 C102 88 60 110 60 110 C60 110 18 88 18 62 V26 L60 10 Z"
            fill="url(#shieldFill)"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Inner Geometric Rosette Grid Lines */}
          <motion.path
            d="M60 18 L94 32 V60 C94 80 60 98 60 98 C60 98 26 80 26 60 V32 L60 18 Z"
            stroke="#C8A35A"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          {/* Central Precision Brand Check V Emblem */}
          <motion.path
            d="M38 60 L53 75 L84 42"
            stroke="url(#goldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          />

          {/* Additional Precision Notch */}
          <motion.circle
            cx="60"
            cy="24"
            r="2.5"
            fill="#F5ECD2"
            initial={{ scale: 0 }}
            animate={visible ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          />

          {/* Dynamic Light Sweep Beam moving across shield */}
          {visible && (
            <g clipPath="url(#shieldClip)">
              <motion.rect
                x="-100"
                y="0"
                width="60"
                height="120"
                fill="url(#lightSweep)"
                transform="rotate(25 60 60)"
                animate={{
                  x: ['-80px', '160px'],
                }}
                transition={{
                  delay: 0.9,
                  duration: 0.9,
                  ease: 'easeInOut',
                }}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Brand Title Drawing & Tagline */}
      <motion.div
        className="mt-3"
        initial={{ opacity: 0, y: 8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="font-serif text-lg tracking-[0.25em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-champagne uppercase">
          VERITY
        </div>
        <div className="text-[10px] uppercase tracking-widest text-gold/70 font-mono mt-0.5">
          Deterministic Governance Engine
        </div>
      </motion.div>
    </div>
  );
}

