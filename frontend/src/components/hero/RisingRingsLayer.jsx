import React from 'react';
import { motion } from 'framer-motion';

/**
 * Continuous Rising Golden Rings Layer
 * Thin golden circular and elliptical rings continuously rise from below the viewport,
 * expanding gradually and traveling upward with depth and delicate glowing nodes.
 */
export function RisingRingsLayer() {
  // Ring definitions with varied sizes, speeds, opacities, and angles
  const rings = [
    { id: 1, baseW: 320, baseH: 90, duration: 8.5, delay: 0.0, maxScale: 1.7, opacity: 0.45, rotate: -12 },
    { id: 2, baseW: 420, baseH: 120, duration: 10.5, delay: 2.2, maxScale: 1.6, opacity: 0.55, rotate: 16 },
    { id: 3, baseW: 240, baseH: 70, duration: 7.2, delay: 4.0, maxScale: 1.9, opacity: 0.35, rotate: -8 },
    { id: 4, baseW: 520, baseH: 140, duration: 12.0, delay: 5.8, maxScale: 1.5, opacity: 0.4, rotate: 10 },
    { id: 5, baseW: 360, baseH: 100, duration: 9.0, delay: 7.5, maxScale: 1.8, opacity: 0.5, rotate: -15 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
      {rings.map((ring) => (
        <motion.div
          key={ring.id}
          className="absolute rounded-[100%] border border-[#E8B84B] pointer-events-none"
          style={{
            width: ring.baseW,
            height: ring.baseH,
            boxShadow: '0 0 15px rgba(232, 184, 75, 0.35), inset 0 0 15px rgba(232, 184, 75, 0.2)',
          }}
          initial={{
            y: '160%',
            scale: 0.4,
            opacity: 0,
            rotate: ring.rotate,
          }}
          animate={{
            y: ['160%', '-120%'],
            scale: [0.4, ring.maxScale],
            opacity: [0, ring.opacity, ring.opacity, 0],
            rotate: [ring.rotate, ring.rotate + 18],
          }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Subtle glowing energy bead traveling on the ring edge */}
          <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-[#FFF1B8] shadow-[0_0_8px_#FFF1B8]" />
          <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-[#E8B84B] shadow-[0_0_6px_#E8B84B]" />
        </motion.div>
      ))}

      {/* Ground Concentric Ripples at Bottom Under the Book */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[460px] h-[100px] pointer-events-none flex items-center justify-center">
        <motion.div
          className="absolute rounded-[100%] border border-[#E8B84B]/40"
          animate={{ scale: [0.6, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%' }}
        />
        <motion.div
          className="absolute rounded-[100%] border border-[#FFF1B8]/50"
          animate={{ scale: [0.4, 1.1], opacity: [0.8, 0] }}
          transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: 'easeOut' }}
          style={{ width: '80%', height: '80%' }}
        />
      </div>
    </div>
  );
}

