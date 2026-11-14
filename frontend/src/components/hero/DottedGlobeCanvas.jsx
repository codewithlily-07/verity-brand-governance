import React, { useEffect, useRef } from 'react';

/**
 * 2D Canvas rendering:
 * 1. Rotating 3D Fibonacci Dotted Sphere:
 *    - ~950 points on a Fibonacci sphere
 *    - Light fall-off from top-left, fading gracefully to the right
 *    - Sized to be perfectly concentric with parent circle
 * 2. Continuously rising gold dust particles
 */
export function DottedGlobeCanvas({ active = true, progress = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 500;
      height = canvas.height = canvas.parentElement.clientHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    // 1. Generate Fibonacci Sphere Points (~950 points)
    const numPoints = 950;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const spherePoints = [];
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      spherePoints.push({ x, y, z, baseAlpha: Math.random() * 0.4 + 0.6 });
    }

    // 2. Upward drifting gold dust particles pool (45 particles)
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: Math.random() * 1.6 + 0.5,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const sphereRadius = Math.min(width, height) * 0.45;

      // A. Upward Floating Gold Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < -10) {
          p.y = height + Math.random() * 30;
          p.x = Math.random() * width;
        }

        const twinkle = 0.5 + Math.sin(p.twinklePhase) * 0.5;
        const currentAlpha = p.alpha * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 217, 139, ${currentAlpha * progress})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
      }

      // B. Rotating Fibonacci Dotted Globe
      rotationAngle += 0.0032;
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);

      // Light vector pointing from upper-left forward (-0.55, -0.55, 0.62)
      const lightX = -0.55;
      const lightY = -0.55;
      const lightZ = 0.62;

      for (let i = 0; i < spherePoints.length; i++) {
        const pt = spherePoints[i];

        // Rotate point around Y axis
        const rotX = pt.x * cosA - pt.z * sinA;
        const rotZ = pt.x * sinA + pt.z * cosA;
        const rotY = pt.y;

        // Front-facing points only (rotZ > -0.25)
        if (rotZ > -0.25) {
          const dot = rotX * lightX + rotY * lightY + rotZ * lightZ;
          const illumination = Math.max(0.04, dot);

          const projX = centerX + rotX * sphereRadius;
          const projY = centerY + rotY * sphereRadius * 0.96;

          const dotSize = (0.7 + (rotZ + 1) * 0.7) * (0.8 + illumination * 0.6);
          const alpha = (0.05 + illumination * 0.88) * pt.baseAlpha * progress;

          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.6, dotSize), 0, Math.PI * 2);

          if (illumination > 0.5) {
            ctx.fillStyle = `rgba(243, 217, 139, ${alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
          } else {
            ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.8})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}
    />
  );
}
