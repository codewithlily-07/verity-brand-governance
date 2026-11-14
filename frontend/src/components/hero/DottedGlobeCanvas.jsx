import React, { useEffect, useRef } from 'react';

/**
 * 2D Canvas rendering:
 * 1. Rotating 3D Fibonacci Dotted Sphere:
 *    - ~1,200 points on a Fibonacci sphere
 *    - Denser and brighter on left and upper-left (light source), fading to dark on right
 * 2. Continuously rising gold dust particles floating upward from bottom to top
 * 3. Layered dotted ground waves along the bottom
 */
export function DottedGlobeCanvas({ active = true, progress = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 1200;
      height = canvas.height = canvas.parentElement.clientHeight || 750;
    };
    window.addEventListener('resize', handleResize);

    // 1. Generate Fibonacci Sphere Points (~1,000 points)
    const numPoints = 950;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const sphereRadius = Math.min(width * 0.17, 185);
    const globeCenterY = height * 0.43;

    const spherePoints = [];
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      spherePoints.push({ x, y, z, baseAlpha: Math.random() * 0.4 + 0.6 });
    }

    // 2. Upward drifting gold dust particles pool (60 particles)
    const particleCount = 55;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      radius: Math.random() * 1.8 + 0.6,
      speedY: Math.random() * 0.7 + 0.35,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = globeCenterY;

      // ----------------------------------------------------
      // A. Draw Upward Floating Gold Dust Particles
      // ----------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.twinklePhase += p.twinkleSpeed;

        if (p.y < -20) {
          p.y = height + Math.random() * 50;
          p.x = Math.random() * width;
        }

        const twinkle = 0.5 + Math.sin(p.twinklePhase) * 0.5;
        const currentAlpha = p.alpha * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 241, 184, ${currentAlpha * progress})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(232, 184, 75, 0.5)';
        ctx.fill();
      }

      // ----------------------------------------------------
      // B. Draw Rotating Fibonacci Dotted Globe
      // ----------------------------------------------------
      rotationAngle += 0.0035;
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);

      // Light vector pointing from upper-left forward (-0.5, -0.6, 0.6)
      const lightX = -0.55;
      const lightY = -0.55;
      const lightZ = 0.62;

      for (let i = 0; i < spherePoints.length; i++) {
        const pt = spherePoints[i];

        // Rotate point around Y axis
        const rotX = pt.x * cosA - pt.z * sinA;
        const rotZ = pt.x * sinA + pt.z * cosA;
        const rotY = pt.y;

        // Front-facing points only (rotZ > -0.15) for clean depth
        if (rotZ > -0.25) {
          // Calculate lighting: dot product with light vector
          const dot = rotX * lightX + rotY * lightY + rotZ * lightZ;
          const illumination = Math.max(0.04, dot); // Falloff to right side

          // Screen projection
          const projX = centerX + rotX * sphereRadius;
          const projY = centerY + rotY * sphereRadius * 0.95; // subtle tilt

          const dotSize = (0.7 + (rotZ + 1) * 0.7) * (0.8 + illumination * 0.6);
          const alpha = (0.05 + illumination * 0.88) * pt.baseAlpha * progress;

          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.6, dotSize), 0, Math.PI * 2);
          // Highlight color: gold-light for illuminated side, amber for shadow side
          if (illumination > 0.5) {
            ctx.fillStyle = `rgba(255, 241, 184, ${alpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(232, 184, 75, 0.4)';
          } else {
            ctx.fillStyle = `rgba(232, 184, 75, ${alpha * 0.8})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      // ----------------------------------------------------
      // C. Layered Golden Dotted Waves Along the Bottom
      // ----------------------------------------------------
      const waveY = height * 0.92;
      const wavePoints = 48;
      ctx.shadowBlur = 0;

      for (let row = 0; row < 3; row++) {
        const rowOffsetY = row * 14;
        const rowAlpha = (0.28 - row * 0.08) * progress;

        for (let j = 0; j < wavePoints; j++) {
          const t = j / (wavePoints - 1);
          const wx = t * width;
          const sine = Math.sin(t * Math.PI * 3 + rotationAngle * 1.5 + row);
          const wy = waveY + sine * 8 + rowOffsetY;

          ctx.beginPath();
          ctx.arc(wx, wy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 184, 75, ${rowAlpha})`;
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
