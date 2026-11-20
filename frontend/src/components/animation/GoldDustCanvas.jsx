import React, { useEffect, useRef } from 'react';

/**
 * GoldDustCanvas
 * High-performance 60fps HTML5 Canvas overlay for Gold Refinement particle motes.
 * Features:
 * - Additive blending ('lighter') with gold gradient (#FFF1BD -> #E2B857 -> #B98A2E)
 * - Quadratic curved trajectories easing into/out of the lens ring
 * - Hard cap at 160 particles
 * - DPR capped at 2 to conserve GPU fill rate
 * - Tab visibility listener pauses animation when tab is in background
 * - Hardware concurrency & low-power detection gracefully bypasses simulation
 */
export function GoldDustCanvas({
  active = false,
  phase = 'release', // 'release' | 'reform' | 'idle'
  sourceRects = [],
  targetRects = [],
  lensPosition = { x: 300, y: 80 },
  onReformComplete,
  className = '',
  maxParticles = 160,
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const isTabHiddenRef = useRef(false);

  // Check low power / reduced capability
  const isLowPower = typeof navigator !== 'undefined' && (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.connection && navigator.connection.saveData)
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabHiddenRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Spawn particles when active and phase changes
  useEffect(() => {
    if (!active || isLowPower) {
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    if (phase === 'release' && sourceRects && sourceRects.length > 0) {
      // Spawn 5 to 8 particles per source letter rect
      const newParticles = [];
      const particlePerLetter = Math.max(3, Math.min(8, Math.floor(maxParticles / Math.max(1, sourceRects.length))));

      for (let sIdx = 0; sIdx < sourceRects.length; sIdx++) {
        const rect = sourceRects[sIdx];
        if (!rect) continue;
        const relX = rect.left - canvasRect.left + rect.width / 2;
        const relY = rect.top - canvasRect.top + rect.height / 2;

        for (let p = 0; p < particlePerLetter; p++) {
          if (newParticles.length >= maxParticles) break;

          const jitterX = (Math.random() - 0.5) * rect.width;
          const jitterY = (Math.random() - 0.5) * rect.height;
          const startX = relX + jitterX;
          const startY = relY + jitterY;

          // Target is lens center
          const targetX = lensPosition.x;
          const targetY = lensPosition.y;

          // Quadratic control point with curve
          const midX = (startX + targetX) / 2;
          const midY = Math.min(startY, targetY) - 20 - Math.random() * 35;
          const curveOffset = (Math.random() - 0.5) * 60;

          newParticles.push({
            startX,
            startY,
            x: startX,
            y: startY,
            controlX: midX + curveOffset,
            controlY: midY,
            targetX,
            targetY,
            progress: 0,
            speed: 0.02 + Math.random() * 0.015,
            delay: (sIdx * 0.01) + (p * 0.005),
            radius: 1.0 + Math.random() * 1.5,
            alpha: 0.9,
            colorIndex: Math.floor(Math.random() * 3), // 0: bright, 1: gold, 2: warm deep gold
            phase: 'to-lens',
          });
        }
      }
      particlesRef.current = newParticles;
    } else if (phase === 'reform' && targetRects && targetRects.length > 0) {
      // Release from lens center outward to target letter rects
      const newParticles = [];
      const particlePerLetter = Math.max(3, Math.min(8, Math.floor(maxParticles / Math.max(1, targetRects.length))));

      for (let tIdx = 0; tIdx < targetRects.length; tIdx++) {
        const rect = targetRects[tIdx];
        if (!rect) continue;
        const relX = rect.left - canvasRect.left + rect.width / 2;
        const relY = rect.top - canvasRect.top + rect.height / 2;

        for (let p = 0; p < particlePerLetter; p++) {
          if (newParticles.length >= maxParticles) break;

          const startX = lensPosition.x + (Math.random() - 0.5) * 16;
          const startY = lensPosition.y + (Math.random() - 0.5) * 16;
          const targetX = relX + (Math.random() - 0.5) * (rect.width * 0.6);
          const targetY = relY + (Math.random() - 0.5) * (rect.height * 0.6);

          const midX = (startX + targetX) / 2;
          const midY = Math.min(startY, targetY) - 15 - Math.random() * 25;
          const curveOffset = (Math.random() - 0.5) * 45;

          newParticles.push({
            startX,
            startY,
            x: startX,
            y: startY,
            controlX: midX + curveOffset,
            controlY: midY,
            targetX,
            targetY,
            progress: 0,
            speed: 0.024 + Math.random() * 0.018,
            delay: (tIdx * 0.018) + (p * 0.004),
            radius: 1.2 + Math.random() * 1.4,
            alpha: 1.0,
            colorIndex: Math.floor(Math.random() * 3),
            phase: 'to-target',
          });
        }
      }
      particlesRef.current = newParticles;
    }
  }, [active, phase, sourceRects, targetRects, lensPosition.x, lensPosition.y, isLowPower, maxParticles]);

  // Animation Loop
  useEffect(() => {
    if (!active || isLowPower) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    const colors = [
      '#FFF1BD', // Bright ivory gold highlight
      '#E2B857', // Signature Verity gold
      '#B98A2E', // Deep amber burnished gold
    ];

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      if (!isTabHiddenRef.current) {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;
        let allComplete = particles.length > 0;

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (p.delay > 0) {
            p.delay -= 0.016;
            allComplete = false;
            continue;
          }

          if (p.progress < 1) {
            p.progress = Math.min(1, p.progress + p.speed);
            allComplete = false;

            // Ease in out cubic for quadratic bezier
            const t = p.progress < 0.5 
              ? 4 * p.progress * p.progress * p.progress 
              : 1 - Math.pow(-2 * p.progress + 2, 3) / 2;

            // Quadratic bezier calculation: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
            const invT = 1 - t;
            p.x = invT * invT * p.startX + 2 * invT * t * p.controlX + t * t * p.targetX;
            p.y = invT * invT * p.startY + 2 * invT * t * p.controlY + t * t * p.targetY;

            // Shimmer alpha
            if (p.phase === 'to-lens') {
              p.alpha = Math.max(0, 1 - p.progress * 0.85);
            } else {
              // Fade into target letter
              p.alpha = p.progress > 0.85 ? Math.max(0, (1 - p.progress) / 0.15) : 1;
            }
          }

          // Draw mote
          if (p.alpha > 0.02) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors[p.colorIndex];
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = '#E2B857';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.restore();
          }
        }

        if (allComplete && phase === 'reform' && onReformComplete) {
          onReformComplete();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [active, phase, isLowPower, onReformComplete]);

  if (isLowPower) {
    return null; // Gracefully degrade on low power devices
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-30 w-full h-full ${className}`}
      style={{ overflow: 'hidden' }}
    />
  );
}
