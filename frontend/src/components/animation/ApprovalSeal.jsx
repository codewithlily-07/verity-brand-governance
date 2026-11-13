import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, UserCheck, Key } from 'lucide-react';

/**
 * Scene 5: Human Review Verification Seal
 * Renders an animated SVG circular gold seal, crisp checkmark drawing,
 * human reviewer sign-off badge, and cryptographic audit hash stamp.
 */
export function ApprovalSeal({ active = true, onReplay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Dynamic Animated SVG Gold Seal */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        {/* Soft Gold Radial Halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gold/20 blur-xl pointer-events-none"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg
          viewBox="0 0 140 140"
          className="w-full h-full drop-shadow-[0_0_25px_rgba(200,163,90,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D1" />
              <stop offset="45%" stopColor="#C8A35A" />
              <stop offset="100%" stopColor="#8C6A23" />
            </linearGradient>

            <linearGradient id="sealBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18285A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0A1128" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* Outer Serrated / Notched Ring */}
          <motion.circle
            cx="70"
            cy="70"
            r="64"
            fill="url(#sealBg)"
            stroke="url(#sealGold)"
            strokeWidth="2"
            strokeDasharray="4 2"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Inner Concentric Border */}
          <motion.circle
            cx="70"
            cy="70"
            r="54"
            stroke="url(#sealGold)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, delay: 0.2 }}
          />

          {/* Circular Text Path: VERITY BRAND GOVERNANCE */}
          <path
            id="textPath"
            d="M 70 70 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            fill="none"
          />
          <text className="text-[7.5px] font-mono tracking-[0.22em] fill-[#EAD7A1] uppercase font-bold">
            <textPath href="#textPath" startOffset="50%" textAnchor="middle">
              • VERIFIED & COMPLIANT • PUBLICATION READY •
            </textPath>
          </text>

          {/* Center Checkmark SVG Draw */}
          <motion.path
            d="M48 72 L64 88 L94 54"
            stroke="url(#sealGold)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          />
        </svg>

        {/* Pulse ring shockwave on seal completion */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-gold pointer-events-none"
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      {/* Main Status Headline */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal/20 border border-teal text-teal text-xs font-mono font-bold tracking-wider uppercase mb-1 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          CONTENT APPROVED
        </span>
        <h4 className="font-serif text-lg text-white font-bold tracking-tight">
          Human Review Completed
        </h4>
        <p className="text-xs text-gray-400 max-w-xs mt-1">
          All 3 findings resolved with intent-preserving corrections and verified facts.
        </p>
      </motion.div>

      {/* Human Reviewer Sign-Off Credentials Bar */}
      <motion.div
        className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-md p-2.5 rounded-xl bg-navy/90 border border-gold/30 text-left text-xs"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center text-teal font-bold font-mono text-xs">
            EV
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-1">
              <span>Elena Vance</span>
              <span className="text-[10px] text-gray-400 font-normal">· Senior Reviewer</span>
            </div>
            <div className="text-[10px] text-teal flex items-center gap-1 font-mono">
              <UserCheck className="w-3 h-3" />
              <span>Full Sign-off Authority</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Hash Badge */}
        <div className="text-right">
          <div className="text-[10px] text-gray-400 flex items-center gap-1 sm:justify-end font-mono">
            <Key className="w-3 h-3 text-gold" />
            <span>SHA-256 Audit Seal</span>
          </div>
          <div className="font-mono text-[11px] text-gold-light font-bold">
            e7a9f4c2810d...
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

