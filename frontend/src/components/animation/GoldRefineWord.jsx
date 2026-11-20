import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * GoldRefineWord
 * Reusable Gold Refinement animation for in-app Accept, Hero living draft, and Try-it preview.
 * - Detect: Amber warm pulse (#E9A23B) with text-shadow glow
 * - Release: Letters lift 3-4px, blur slightly, dissolve upward in fine gold motes
 * - Reform: Letters condense into corrected copy with blur-to-sharp transition and brief gold underline sweep
 * - Deletion: If correctedText is empty, words dissolve and width collapses smoothly with no layout jump
 * - Reduced motion: Smooth cross-fade without motes
 */
export function GoldRefineWord({
  originalText = '',
  correctedText = '',
  isRefining = false,
  isResolved = false,
  durationMs = 700,
  onComplete,
  className = '',
  isLightBackground = false,
}) {
  const prefersReduced = useReducedMotion();
  const [animPhase, setAnimPhase] = useState('idle'); // 'idle' | 'dissolve' | 'condense' | 'complete'

  useEffect(() => {
    if (!isRefining) return;

    if (prefersReduced) {
      setAnimPhase('complete');
      if (onComplete) onComplete();
      return;
    }

    setAnimPhase('dissolve');

    const dissolveDuration = Math.round(durationMs * 0.4);
    const condenseDuration = Math.round(durationMs * 0.45);
    const sweepDuration = Math.round(durationMs * 0.15);

    const t1 = setTimeout(() => {
      setAnimPhase('condense');
    }, dissolveDuration);

    const t2 = setTimeout(() => {
      setAnimPhase('sweep');
    }, dissolveDuration + condenseDuration);

    const t3 = setTimeout(() => {
      setAnimPhase('complete');
      if (onComplete) onComplete();
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isRefining, durationMs, prefersReduced, onComplete]);

  const textColor = isLightBackground ? 'text-[#0A1230]' : 'text-[#F4F1E8]';
  const resolvedColor = isLightBackground ? 'text-[#085C42] font-semibold' : 'text-[#2ECC9A] font-semibold';
  const isDeletion = !correctedText || correctedText.trim().length === 0;

  // If already resolved from props
  if (isResolved || animPhase === 'complete') {
    if (isDeletion) {
      return (
        <motion.span
          initial={{ width: 'auto', opacity: 1 }}
          animate={{ width: 0, opacity: 0, margin: 0, padding: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="inline-block overflow-hidden"
          aria-hidden="true"
        />
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 ${resolvedColor} ${className}`}>
        <span className="sr-only">Verified copy: </span>
        <span>{correctedText}</span>
      </span>
    );
  }

  return (
    <span className={`relative inline-flex items-center align-baseline ${className}`}>
      {/* Screen Reader Label */}
      <span className="sr-only">
        {animPhase === 'idle' ? `Flagged draft: ${originalText}` : `Refining copy into: ${correctedText || 'removed'}`}
      </span>

      <span aria-hidden="true" className="relative inline-flex items-center">
        {/* Dissolve Phase: Original Text lifting, amber warming, motes burst */}
        {(animPhase === 'idle' || animPhase === 'dissolve') && (
          <motion.span
            className={`inline-block px-1 rounded transition-colors ${
              animPhase === 'dissolve'
                ? 'text-[#E2B857]'
                : 'text-[#E9A23B]'
            }`}
            style={{
              textShadow: animPhase === 'dissolve'
                ? '0 0 16px rgba(226, 184, 87, 0.9), 0 0 28px rgba(233, 162, 59, 0.6)'
                : '0 0 10px rgba(233, 162, 59, 0.6), 0 0 18px rgba(233, 162, 59, 0.3)',
            }}
            animate={animPhase === 'dissolve' ? {
              y: -4,
              opacity: 0,
              filter: 'blur(2px)',
              scale: 0.96,
            } : {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            transition={{ duration: durationMs * 0.0004, ease: 'easeOut' }}
          >
            {originalText}

            {/* Micro Gold Motes Burst during Dissolve */}
            {animPhase === 'dissolve' && !prefersReduced && (
              <span className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: (i % 2 === 0 ? 1 : -1) * (10 + i * 4),
                      y: -(12 + (i % 3) * 8),
                      opacity: 0,
                      scale: 0.4,
                    }}
                    transition={{ duration: durationMs * 0.0004, ease: 'easeOut' }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-[#E2B857] shadow-[0_0_8px_#E2B857]"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: '30%',
                    }}
                  />
                ))}
              </span>
            )}
          </motion.span>
        )}

        {/* Condense / Sweep Phase: Corrected text condensing letter by letter */}
        {(animPhase === 'condense' || animPhase === 'sweep') && !isDeletion && (
          <motion.span
            initial={{ opacity: 0, filter: 'blur(3px)', y: 3 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: durationMs * 0.00045, ease: 'easeOut' }}
            className={`inline-block ${textColor} font-medium relative`}
          >
            {correctedText}

            {/* Gold Underline Sweep */}
            {animPhase === 'sweep' && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: [0, 1, 0.7, 0] }}
                transition={{ duration: durationMs * 0.0002, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E2B857] to-transparent pointer-events-none"
              />
            )}
          </motion.span>
        )}
      </span>
    </span>
  );
}
