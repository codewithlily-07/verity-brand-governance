import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GoldDustCanvas } from './GoldDustCanvas';

/**
 * SealOfVerityIntro (~4.2 s opening signature moment)
 * - Gold Refinement: risky phrases warm to amber with pulsing glow,
 *   dissolve into fine gold motes streaming into the lens,
 *   condensing letter-by-letter into verified copy.
 * - ZERO red, pink, strike-through, or line-through lines anywhere.
 * - Skippable via button or Esc key
 * - Replayable via window event 'verity:replay-intro'
 * - Graceful degradation on mobile, low-power, and prefers-reduced-motion
 */
export function SealOfVerityIntro({ onComplete }) {
  const prefersReduced = useReducedMotion();
  
  // stage 0: gold hairline drawing (0.0 - 0.4s)
  // stage 1: draft sentence typing (0.4 - 1.3s)
  // stage 2: lens glide & amber warming with rule tags (1.3 - 1.8s)
  // stage 3: letters lift, dissolve into gold dust into lens (1.8 - 2.4s)
  // stage 4: motes condense letter-by-letter into corrected copy + gold underline sweep (2.4 - 3.1s)
  // stage 5: lens contracts, V seal morphs & VERITY letters rise (3.1 - 3.7s)
  // stage 6: seal shrinks & dissolves into page (3.7 - 4.2s)
  const [stage, setStage] = useState(0);

  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('verity_seal_intro_played');
  });

  // Track bounding boxes for particle spawning
  const [sourceRects, setSourceRects] = useState([]);
  const [targetRects, setTargetRects] = useState([]);
  const [lensPos, setLensPos] = useState({ x: 300, y: 80 });

  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const flaggedLettersRef = useRef([]);
  const correctedLettersRef = useRef([]);

  // Check low power / mobile
  const isMobileOrLowPower = typeof window !== 'undefined' && (
    window.innerWidth < 640 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.connection && navigator.connection.saveData)
  );

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

  // 4.2s Sequence Timer (or 2.8s for low-power/mobile)
  useEffect(() => {
    if (!visible) return;

    if (prefersReduced) {
      setStage(4);
      const reducedTimer = setTimeout(() => {
        setStage(5);
        setTimeout(finishIntro, 500);
      }, 500);
      return () => clearTimeout(reducedTimer);
    }

    if (isMobileOrLowPower) {
      // Streamlined 2.8s timeline
      const t1 = setTimeout(() => setStage(1), 300);
      const t2 = setTimeout(() => setStage(2), 800);
      const t3 = setTimeout(() => setStage(3), 1300);
      const t4 = setTimeout(() => setStage(4), 1700);
      const t5 = setTimeout(() => setStage(5), 2300);
      const t6 = setTimeout(() => finishIntro(), 2850);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
      };
    }

    // Standard 4.2s sequence
    const t1 = setTimeout(() => setStage(1), 400);   // 0.4s -> draft types in
    const t2 = setTimeout(() => setStage(2), 1300);  // 1.3s -> lens glides, amber glow & R2/R3 tags
    const t3 = setTimeout(() => {
      // 1.8s -> read rects for particle release
      if (flaggedLettersRef.current.length > 0) {
        setSourceRects(
          flaggedLettersRef.current
            .filter(Boolean)
            .map(el => el.getBoundingClientRect())
        );
      }
      if (lensRef.current && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const lRect = lensRef.current.getBoundingClientRect();
        setLensPos({
          x: lRect.left - cRect.left + lRect.width / 2,
          y: lRect.top - cRect.top + lRect.height / 2,
        });
      }
      setStage(3);
    }, 1800);

    const t4 = setTimeout(() => {
      // 2.4s -> condensation phase
      if (correctedLettersRef.current.length > 0) {
        setTargetRects(
          correctedLettersRef.current
            .filter(Boolean)
            .map(el => el.getBoundingClientRect())
        );
      }
      setStage(4);
    }, 2400);

    const t5 = setTimeout(() => setStage(5), 3100);  // 3.1s -> lens morphs to V seal & VERITY letters
    const t6 = setTimeout(() => finishIntro(), 4200); // 4.2s -> dissolve into main page

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [visible, prefersReduced, isMobileOrLowPower]);

  if (!visible) return null;

  const flaggedPhrase = "best in India!";
  const correctedSentence = "Our platform supports verified online learning.";

  return (
    <AnimatePresence>
      <motion.div
        key="seal-intro-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ backgroundColor: '#0A1226' }}
        role="dialog"
        aria-modal="true"
        aria-label="Verity Opening Signature Moment"
      >
        {/* Screen Reader Announcement */}
        <div className="sr-only" aria-live="polite">
          {stage >= 4 
            ? "Verity verification complete: Our platform supports verified online learning." 
            : "Verity pre-publication brand governance scanning draft copy."}
        </div>

        {/* Skip button (top right) */}
        <button
          type="button"
          onClick={finishIntro}
          className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-[#101B35]/80 hover:bg-[#17254A] border border-[#E2B857]/40 text-xs font-semibold text-[#F4F1E8] hover:text-[#EBD9A0] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E2B857] z-40"
        >
          Skip Intro (Esc)
        </button>

        {/* Main Stage Center Container */}
        <div 
          ref={containerRef} 
          className="relative w-full max-w-3xl px-6 flex flex-col items-center text-center justify-center min-h-[220px]"
        >
          {/* Gold Dust Canvas Overlay for Motes */}
          <GoldDustCanvas
            active={stage === 3 || stage === 4}
            phase={stage === 3 ? 'release' : stage === 4 ? 'reform' : 'idle'}
            sourceRects={sourceRects}
            targetRects={targetRects}
            lensPosition={lensPos}
            maxParticles={160}
          />

          {/* STAGE 0 to 4: The Sentence Refinement Experience */}
          {stage < 5 && (
            <div className="relative w-full flex flex-col items-center justify-center min-h-[160px]">
              
              {/* STAGE 0: Thin gold hairline drawing from center outwards (0.0 - 0.4s) */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: stage >= 0 ? '100%' : 0, opacity: stage < 4 ? 1 : 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute h-[1px] top-1/2 -translate-y-1/2 pointer-events-none z-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(226,184,87,0.3) 15%, #E2B857 50%, rgba(226,184,87,0.3) 85%, transparent 100%)',
                  boxShadow: '0 0 12px rgba(226, 184, 87, 0.4)'
                }}
              />

              {/* STAGE 1, 2, 3: Draft copy with Gold Refinement warming & motes */}
              {stage < 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 font-serif text-xl sm:text-2xl text-[#F4F1E8] px-6 py-4 bg-[#0A1226]/90 rounded-2xl max-w-2xl leading-relaxed flex flex-wrap items-center justify-center gap-x-1.5"
                  aria-hidden="true"
                >
                  <span>Our platform is the</span>

                  {/* Flagged Phrase: "best in India!" (Rule R3 Unbacked Superlative) */}
                  <span className="relative inline-flex items-center">
                    <span 
                      className={`inline-flex transition-all duration-300 ${
                        stage === 2 
                          ? 'text-[#E9A23B]' 
                          : stage === 3 
                            ? 'text-[#E2B857] blur-[1.5px] -translate-y-1 opacity-20' 
                            : 'text-[#F4F1E8]'
                      }`}
                      style={stage === 2 ? {
                        textShadow: '0 0 12px rgba(233,162,59,0.75), 0 0 24px rgba(233,162,59,0.4)',
                      } : {}}
                    >
                      {flaggedPhrase.split('').map((char, cIdx) => (
                        <span
                          key={cIdx}
                          ref={el => { if (el) flaggedLettersRef.current.push(el); }}
                          className={`inline-block transition-transform duration-300 ${stage === 3 ? '-translate-y-1 scale-95' : ''}`}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </span>

                    {/* Rule R3 Tag fading in on Stage 2 */}
                    {stage === 2 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E9A23B]/20 text-[#E9A23B] border border-[#E9A23B]/50 leading-none shadow-[0_0_8px_rgba(233,162,59,0.4)]"
                      >
                        R3
                      </motion.span>
                    )}
                  </span>
                </motion.div>
              )}

              {/* Lens Ring Gliding Across (Stage 2 & 3) */}
              {(stage === 2 || stage === 3) && (
                <motion.div
                  ref={lensRef}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ 
                    x: stage === 2 ? 80 : 120, 
                    opacity: 1,
                    scale: stage === 3 ? 1.15 : 1
                  }}
                  transition={{ duration: stage === 2 ? 0.65 : 0.45, ease: 'easeInOut' }}
                  className="absolute pointer-events-none w-16 h-16 rounded-full border-2 border-[#E2B857] z-20 flex items-center justify-center"
                  style={{
                    boxShadow: stage === 3 
                      ? '0 0 35px rgba(226, 184, 87, 0.95), inset 0 0 20px rgba(226, 184, 87, 0.6)' 
                      : '0 0 25px rgba(226, 184, 87, 0.75), inset 0 0 15px rgba(226, 184, 87, 0.4)',
                    background: 'radial-gradient(circle, rgba(226,184,87,0.25) 0%, transparent 75%)'
                  }}
                />
              )}

              {/* STAGE 4: Corrected sentence condenses letter by letter (2.4 - 3.1s) */}
              {stage === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 font-serif text-xl sm:text-2xl text-[#F4F1E8] px-6 py-4 bg-[#101B35] border border-[#E2B857]/40 rounded-2xl shadow-2xl flex items-center gap-3 overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E2B857]/20 border border-[#E2B857] flex items-center justify-center flex-shrink-0">
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-[#E2B857]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </div>

                  {/* Letter by letter condensation with quick shimmer */}
                  <div className="relative inline-block">
                    {correctedSentence.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        ref={el => { if (el) correctedLettersRef.current.push(el); }}
                        initial={{ opacity: 0, filter: 'blur(3px)', color: '#E2B857', y: 3 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', color: '#F4F1E8', y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: i * 0.024, 
                          ease: 'easeOut' 
                        }}
                        className="inline-block"
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}

                    {/* Gold underline sweep under finished sentence */}
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '100%', opacity: [0, 1, 0.8, 0] }}
                      transition={{ duration: 0.55, delay: 0.65, ease: 'easeInOut' }}
                      className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E2B857] to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* STAGE 5: Gold Seal of Verity Morph & Brand Title (3.1 - 3.7s) */}
          {stage >= 5 && (
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
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

              {/* Title Letters Rising with Stagger */}
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
                animate={{ opacity: 0.9 }}
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
