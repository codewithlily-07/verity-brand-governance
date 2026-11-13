import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated SVG bezier connector lines between flagged document text markers
 * and their corresponding evidence cards. Includes flowing photon packets and glowing highlights.
 */
export function EvidenceConnector({
  startX,
  startY,
  endX,
  endY,
  active = true,
  isHighlighted = false,
  color = '#C8A35A',
}) {
  if (!active) return null;

  // Calculate smooth cubic bezier control points
  const dx = endX - startX;
  const cpx1 = startX + dx * 0.45;
  const cpy1 = startY;
  const cpx2 = startX + dx * 0.55;
  const cpy2 = endY;

  const pathD = `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`;

  return (
    <g className="evidence-connector pointer-events-none">
      {/* Background soft glow track */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={isHighlighted ? 4 : 2}
        strokeOpacity={isHighlighted ? 0.6 : 0.25}
        filter={isHighlighted ? 'drop-shadow(0 0 6px #C8A35A)' : undefined}
      />

      {/* Main crisp line with stroke draw animation */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={isHighlighted ? '#F5ECD2' : color}
        strokeWidth={isHighlighted ? 2 : 1.2}
        strokeDasharray={isHighlighted ? '4 3' : '3 3'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Start and end anchor nodes */}
      <circle cx={startX} cy={startY} r={isHighlighted ? 3.5 : 2.5} fill={color} />
      <circle cx={endX} cy={endY} r={isHighlighted ? 3.5 : 2.5} fill={color} />

      {/* Traveling energy photon packet */}
      <motion.circle
        r={isHighlighted ? 3.5 : 2}
        fill="#FFFFFF"
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('${pathD}')`,
        }}
      />
    </g>
  );
}

