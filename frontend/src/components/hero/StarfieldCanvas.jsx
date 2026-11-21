import React, { useEffect, useRef } from 'react';

/**
 * Background Starfield Canvas:
 * - 80 tiny stars twinkling (opacity 0.2 to 1.0, 2-5s cycle)
 * - 25 gold dust particles drifting slowly upward with subtle lateral drift
 * - Pauses when document is hidden
 */
export function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 80 Stars
    const starCount = 80;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      radius: Math.random() * 1.1 + 0.4,
      baseAlpha: Math.random() * 0.4 + 0.3,
      twinkleSpeed: (Math.PI * 2) / ((Math.random() * 3 + 2) * 60), // 2-5s
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // 25 Drifting Gold Particles
    const particleCount = 25;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      radius: Math.random() * 1.5 + 0.6,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.6 + 0.25,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let isVisible = !document.hidden;
    const handleVisChange = () => {
      isVisible = !document.hidden;
      if (isVisible) animationFrameId = requestAnimationFrame(render);
      else cancelAnimationFrame(animationFrameId);
    };
    document.addEventListener('visibilitychange', handleVisChange);

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Render 80 Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = 0.2 + (Math.sin(s.twinklePhase) * 0.5 + 0.5) * 0.8;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 242, 231, ${currentAlpha * s.baseAlpha})`;
        ctx.fill();
      }

      // Render 25 Gold Dust Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const twinkle = 0.6 + Math.sin(p.twinklePhase) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 217, 139, ${p.alpha * twinkle})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

