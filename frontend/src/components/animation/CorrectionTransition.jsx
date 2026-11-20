import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

/**
 * Scene 4: Evidence & Intent-Preserving Correction Transition
 * Renders rule citation, grounded factual evidence, and side-by-side or morphing
 * diff from violating claim to approved copy.
 */
export function CorrectionTransition({
  item,
  isExpanded = false,
  isHighlighted = false,
  onHover,
}) {
  const {
    id,
    ruleId,
    ruleName,
    severity,
    originalText,
    correctedText,
    evidenceSnippet,
    evidenceSource,
    reason,
  } = item;

  return (
    <motion.div
      layout
      onMouseEnter={() => onHover && onHover(id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`relative rounded-xl border p-3.5 transition-all bg-midnight/95 backdrop-blur-md ${
        isHighlighted
          ? 'border-gold shadow-[0_0_18px_rgba(200,163,90,0.35)] ring-1 ring-gold'
          : 'border-gray-800 hover:border-gray-700'
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Header: Rule Pill + Severity */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/15 text-gold-light border border-gold/30">
            {ruleId}
          </span>
          <span className="text-xs font-semibold text-gray-200 line-clamp-1">
            {ruleName}
          </span>
        </div>

        <span
          className={`text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.2 rounded border ${
            severity === 'high'
              ? 'bg-coral/20 text-coral border-coral/40'
              : 'bg-amber/20 text-amber-300 border-amber/40'
          }`}
        >
          {severity === 'high' ? 'Strict Breach' : 'Caution'}
        </span>
      </div>

      {/* Reason Description */}
      <p className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">
        {reason}
      </p>

      {/* Side-by-side or Morphing Word Diff */}
      <div className="space-y-1.5 text-xs font-sans rounded-lg bg-navy/80 p-2.5 border border-navy-2">
        <div className="flex items-start gap-2">
          <span className="text-[10px] font-mono uppercase text-coral/80 mt-0.5 font-bold">Draft:</span>
          <span className="text-coral/90 bg-coral/10 border-b border-coral/50 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
            <span className="sr-only">Original draft: </span>
            <span aria-hidden="true" className="font-bold text-[11px] leading-none opacity-80">−</span>
            <span>"{originalText}"</span>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-[10px] font-mono uppercase text-teal mt-0.5 font-bold">Fixed:</span>
          <motion.span
            className="text-teal font-medium bg-teal/15 px-1.5 py-0.5 rounded border border-teal/30 inline-flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span>"{correctedText}"</span>
            <Check className="w-3 h-3 text-teal flex-shrink-0" />
          </motion.span>
        </div>
      </div>

      {/* Grounded Fact Evidence Citation */}
      <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5 truncate">
          <BookOpen className="w-3 h-3 text-gold flex-shrink-0" />
          <span className="font-mono text-gold-light truncate">{evidenceSource}</span>
        </div>
        <span className="text-[9px] text-gray-500 italic shrink-0">100% Fact-Checked</span>
      </div>
    </motion.div>
  );
}

