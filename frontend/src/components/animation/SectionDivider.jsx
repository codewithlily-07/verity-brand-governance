import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated gold energy line divider that draws smoothly when scrolled into view,
 * featuring a luminous central diamond node and subtle gold aura.
 */
export function SectionDivider({ className = '' }) {
  return (
    <div className={`relative w-full max-w-4xl mx-auto py-8 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Left drawing line */}
      <motion.div
        className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-gold"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />

      {/* Central Rosette Diamond Node */}
      <motion.div
        className="relative mx-3 flex items-center justify-center"
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
      >
        <div className="w-2.5 h-2.5 bg-gold border border-gold-light shadow-[0_0_10px_#C8A35A]" />
        <div className="absolute inset-0 bg-gold animate-ping opacity-40 rounded-sm" />
      </motion.div>

      {/* Right drawing line */}
      <motion.div
        className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-gold/40 to-gold"
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />
    </div>
  );
}

