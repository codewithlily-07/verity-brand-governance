import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * Finding marker indicator badge positioned alongside violating text lines.
 * Emits gold/coral energy pulse and expands on user hover.
 */
export function FindingMarker({
  id,
  type,
  label,
  ruleId,
  isHovered,
  isSelected,
  onHover,
  onClick,
}) {
  const isTerm = type === 'term';
  const isClaim = type === 'claim';
  const isTone = type === 'tone';

  const badgeColor = isClaim
    ? 'border-coral/60 bg-coral/15 text-coral'
    : isTerm
    ? 'border-amber/60 bg-amber/15 text-amber-300'
    : 'border-sky/60 bg-sky/15 text-sky-300';

  const Icon = isClaim ? AlertCircle : isTone ? AlertTriangle : Sparkles;

  return (
    <motion.button
      type="button"
      onMouseEnter={() => onHover && onHover(id)}
      onMouseLeave={() => onHover && onHover(null)}
      onClick={() => onClick && onClick(id)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08 }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium transition-all cursor-pointer select-none shadow-sm ${badgeColor} ${
        isHovered || isSelected ? 'ring-2 ring-gold shadow-[0_0_12px_rgba(200,163,90,0.5)]' : ''
      }`}
    >
      <Icon className="w-3 h-3 flex-shrink-0 animate-pulse" />
      <span>{ruleId}</span>
      <span className="hidden sm:inline font-sans text-[10px] opacity-80">· {label}</span>
    </motion.button>
  );
}

