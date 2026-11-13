import React, { useEffect, useRef } from 'react';

/**
 * Controlled canvas particle field with golden energy dust moving along smooth,
 * curved magnetic streamlines toward the center.
 */
export function VerityParticleField({ active = true, density = 36 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool with curved orbits
    const particles = Array.from({ length: density }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      originX: Math.random() * width,
      originY: Math.random() * height,
      radius: Math.random() * 1.8 + 0.8,
      color: i % 3 === 0 ? 'rgba(234, 215, 161, ' : 'rgba(200, 163, 90, ', // gold-light vs gold
      alpha: Math.random() * 0.6 + 0.2,
      targetAlpha: Math.random() * 0.7 + 0.3,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.004,
      distance: Math.random() * 120 + 40,
      orbitRadius: Math.random() * 90 + 30,
      pathT: Math.random(),
    }));

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((p, idx) => {
        p.pathT += p.speed;
        if (p.pathT > 1) {
          p.pathT = 0;
          p.angle = Math.random() * Math.PI * 2;
        }

        // Curved spiral path contracting towards center and pulsing
        const currentDist = p.distance * (1 - p.pathT * 0.7);
        const curAngle = p.angle + p.pathT * 1.5;
        p.x = centerX + Math.cos(curAngle) * currentDist;
        p.y = centerY + Math.sin(curAngle) * (currentDist * 0.65);

        // Alpha fade-in then fade-out near center
        const fade = Math.sin(p.pathT * Math.PI);
        const currentAlpha = p.alpha * fade;

        // Draw particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(200, 163, 90, 0.4)';
        ctx.fill();

        // Connect nearby particles with delicate energy filaments
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 48) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 163, 90, ${0.12 * (1 - dist / 48) * fade})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      t += 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

