import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scene 3: Intelligent Brand Scanning Beam
 * Luminous gold laser beam sweeping vertically through document content,
 * casting forward light sweeps and trailing optical resonance.
 */
export function BrandScanningBeam({ active = false, duration = 2.2 }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <motion.div
        className="w-full relative"
        initial={{ top: '-10%' }}
        animate={{ top: ['-5%', '105%'] }}
        transition={{
          duration: duration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.6,
        }}
      >
        {/* Intense focused gold laser line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#F5ECD2] to-transparent shadow-[0_0_12px_#C8A35A]" />

        {/* Soft forward illumination glow */}
        <div className="h-16 w-full bg-gradient-to-b from-gold/25 via-gold/10 to-transparent -translate-y-[2px]" />

        {/* Floating Scanner Reticle / Crosshair Indicator */}
        <div className="absolute right-4 -top-3 px-2 py-0.5 rounded bg-midnight/90 border border-gold/70 text-[9px] font-mono text-gold-light shadow-lg flex items-center gap-1 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
          <span>SCANNING L1-L3</span>
        </div>
      </motion.div>
    </div>
  );
}

