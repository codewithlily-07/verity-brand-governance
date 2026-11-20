import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * SealOfVerityIntro (~3.5 s opening signature moment)
 * - Pure SVG, CSS, and Framer Motion (no video, no audio)
 * - Plays once per browser session (sessionStorage)
 * - Skippable via button or Esc key
 * - Replayable via window event 'verity:replay-intro' (e.g. clicking the navbar logo)
 * - Respects prefers-reduced-motion (shows final seal for 0.5s then dissolves)
 */
export function SealOfVerityIntro({ onComplete }) {
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState(0); 
  // stage 0: gold line drawing (0.0 - 0.4s)
  // stage 1: draft sentence typing (0.4 - 1.4s)
  // stage 2: lens glide & strike (1.4 - 2.2s)
  // stage 3: corrected line write-in (2.2 - 2.9s)
  // stage 4: ring morph into V mark & VERITY title (2.9 - 3.5s)
  // stage 5: finished / dissolve

  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('verity_seal_intro_played');
  });

  const finishIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('verity_seal_intro_played', 'true');
    }
    setVisible(false);
    if (onComplete) onComplete();
  };

  // Replay listener from navbar logo
  useEffect(() => {
    const handleReplay = () => {
      setVisible(true);
      setStage(0);
    };
    window.addEventListener('verity:replay-intro', handleReplay);
    return () => window.removeEventListener('verity:replay-intro', handleReplay);
  }, []);

  // Keyboard dismiss (Escape or Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sequence Timer
  useEffect(() => {
    if (!visible) return;

    if (prefersReduced) {
      const reducedTimer = setTimeout(() => {
        finishIntro();
      }, 600);
      return () => clearTimeout(reducedTimer);
    }

    const t1 = setTimeout(() => setStage(1), 400);   // 0.4s -> typing
    const t2 = setTimeout(() => setStage(2), 1400);  // 1.4s -> lens scan & strike
    const t3 = setTimeout(() => setStage(3), 2200);  // 2.2s -> corrected line
    const t4 = setTimeout(() => setStage(4), 2900);  // 2.9s -> V seal morph & VERITY
    const t5 = setTimeout(() => finishIntro(), 3600); // 3.6s -> dissolve into page

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [visible, prefersReduced]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="seal-intro-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
        style={{
          backgroundColor: '#0A1226',
        }}
        role="dialog"
        aria-label="Verity Opening Signature Moment"
      >
        {/* Skip button (top right) */}
        <button
          type="button"
          onClick={finishIntro}
          className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-[#101B35]/80 hover:bg-[#17254A] border border-[#E2B857]/40 text-xs font-semibold text-[#F4F1E8] hover:text-[#EBD9A0] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857] z-20"
        >
          Skip Intro (Esc)
        </button>

        {/* Center Container */}
        <div className="relative w-full max-w-2xl px-6 flex flex-col items-center text-center">

          {/* STAGE 0 & 1 & 2 & 3: Sentence & Strike Experience */}
          {stage < 4 && (
            <div className="relative w-full flex flex-col items-center justify-center min-h-[160px]">
              
              {/* Thin gold hairline drawing from center outwards */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute h-[1px] top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(226,184,87,0.3) 15%, #E2B857 50%, rgba(226,184,87,0.3) 85%, transparent 100%)',
                  boxShadow: '0 0 12px rgba(226, 184, 87, 0.4)'
                }}
              />

              {/* Draft text typing in (Stage 1 & 2) */}
              {(stage === 1 || stage === 2) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 font-serif text-xl sm:text-2xl text-[#F4F1E8] px-4 py-2 bg-[#0A1226]/90 rounded-lg max-w-xl leading-relaxed"
                >
                  <span>Our platform </span>
                  <span className={`relative inline-block ${stage === 2 ? 'text-[#D64550]' : 'text-[#E2B857]'}`}>
                    guarantees 100% results
                    {stage === 2 && (
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute left-0 top-1/2 h-[2.5px] bg-[#D64550] block"
                        style={{ boxShadow: '0 0 8px #D64550' }}
                      />
                    )}
                  </span>
                  <span> and is the </span>
                  <span className={`relative inline-block ${stage === 2 ? 'text-[#D64550]' : 'text-[#E2B857]'}`}>
                    best in India!
                    {stage === 2 && (
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 top-1/2 h-[2.5px] bg-[#D64550] block"
                        style={{ boxShadow: '0 0 8px #D64550' }}
                      />
                    )}
                  </span>
                </motion.div>
              )}

              {/* Lens glide ring across risky text during Stage 2 */}
              {stage === 2 && (
                <motion.div
                  initial={{ x: -140, opacity: 0 }}
                  animate={{ x: 140, opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute pointer-events-none w-14 h-14 rounded-full border-2 border-[#E2B857] z-20"
                  style={{
                    boxShadow: '0 0 25px rgba(226, 184, 87, 0.75), inset 0 0 15px rgba(226, 184, 87, 0.4)',
                    background: 'radial-gradient(circle, rgba(226,184,87,0.15) 0%, transparent 70%)'
                  }}
                />
              )}

              {/* Corrected text writes in (Stage 3) */}
              {stage === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="relative z-10 font-serif text-xl sm:text-2xl text-[#F4F1E8] px-6 py-3 bg-[#101B35] border border-[#1E9E78]/50 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1E9E78]/20 border border-[#1E9E78] flex items-center justify-center flex-shrink-0">
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-[#1E9E78]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25 }}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </div>
                  <span>“Our platform supports verified online learning.”</span>
                </motion.div>
              )}
            </div>
          )}

          {/* STAGE 4: Gold Seal of Verity Morph & Brand Title */}
          {stage >= 4 && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Calligraphic Gold V Mark */}
              <div className="relative w-24 h-20 sm:w-28 sm:h-24 mb-5 flex items-center justify-center">
                <svg viewBox="0 0 260 190" className="w-full h-full drop-shadow-[0_0_25px_rgba(226,184,87,0.7)]" fill="none">
                  <defs>
                    <linearGradient id="introV1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A6A24"/>
                      <stop offset="35%" stopColor="#E2B857"/>
                      <stop offset="65%" stopColor="#F4E2AA"/>
                      <stop offset="100%" stopColor="#B9822A"/>
                    </linearGradient>
                    <linearGradient id="introV2" x1="0%" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9A6A1A"/>
                      <stop offset="50%" stopColor="#F3EAD3"/>
                      <stop offset="100%" stopColor="#FFF9E6"/>
                    </linearGradient>
                  </defs>
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                    d="M10 46 C38 26 82 38 112 96 L126 160 C88 134 40 96 10 46 Z" 
                    fill="url(#introV1)"
                  />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    d="M120 164 C122 104 160 40 248 6 C196 44 170 98 150 158 C140 162 130 164 120 164 Z" 
                    fill="url(#introV2)"
                  />
                </svg>
              </div>

              {/* Title Letters Rising */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden mb-2">
                {"VERITY".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-[#F4E2AA] via-[#E2B857] to-[#F4E2AA]"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-xs sm:text-sm font-sans font-semibold tracking-[0.35em] text-[#E2B857] uppercase"
              >
                Intelligent Pre-Publication Brand Governance
              </motion.span>
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
