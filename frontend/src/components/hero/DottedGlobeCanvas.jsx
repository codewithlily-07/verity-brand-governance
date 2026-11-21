import React, { useEffect, useRef } from 'react';

/**
 * High-performance, Retina-crisp Fibonacci Dotted Sphere
 * - 900 points with true 3D perspective projection and depth fade
 * - Front dots are larger and brighter; back dots are smaller and dim
 * - Pure 1:1 spherical aspect ratio (perfect circle)
 * - DevicePixelRatio scaling for razor-sharp rendering on HiDPI screens
 * - Rotation on Y axis (~60s per turn)
 * - Random twinkling highlights
 * - Visibility API listener (pauses RAF when tab is hidden)
 * - Adaptive dot reduction if frame budget is exceeded
 */
export function DottedGlobeCanvas({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let dpr = window.devicePixelRatio || 1;
    let cssWidth = 500;
    let cssHeight = 500;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      cssWidth = rect.width || 500;
      cssHeight = rect.height || 500;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    // Generate Fibonacci Sphere Points
    let targetNumPoints = 900;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const generatePoints = (count) => {
      const pts = [];
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // -1 to 1
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        pts.push({
          x,
          y,
          z,
          twinkleSpeed: Math.random() * 0.05 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          isTwinkler: Math.random() < 0.15,
        });
      }
      return pts;
    };

    let spherePoints = generatePoints(targetNumPoints);

    // Frame Budget Monitoring for 60fps
    let consecutiveSlowFrames = 0;
    let isThrottled = false;
    let lastFrameTime = performance.now();

    // Light source vector from upper-left forward (-0.5, -0.5, 0.7)
    const lightX = -0.5;
    const lightY = -0.5;
    const lightZ = 0.7;
    const lightLen = Math.hypot(lightX, lightY, lightZ);
    const nlx = lightX / lightLen;
    const nly = lightY / lightLen;
    const nlz = lightZ / lightLen;

    let rotationAngle = 0;
    // 60s per full turn (2 * PI in 3600 frames at 60fps => ~0.00174 rad/frame)
    const rotationSpeed = 0.00174;

    let isTabVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (now) => {
      if (!isTabVisible) return;

      // Monitor frame budget
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      if (delta > 24) {
        consecutiveSlowFrames++;
        if (consecutiveSlowFrames > 25 && !isThrottled) {
          isThrottled = true;
          targetNumPoints = 500;
          spherePoints = generatePoints(targetNumPoints);
        }
      } else {
        consecutiveSlowFrames = Math.max(0, consecutiveSlowFrames - 1);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const centerX = cssWidth * 0.5;
      const centerY = cssHeight * 0.5;
      // Pure 1:1 circle radius (46% of container dimension)
      const radius = Math.min(cssWidth, cssHeight) * 0.46;

      rotationAngle += rotationSpeed;
      const cosA = Math.cos(rotationAngle);
      const sinA = Math.sin(rotationAngle);

      // Camera distance for perspective projection
      const cameraDistance = 2.6;

      const len = spherePoints.length;
      for (let i = 0; i < len; i++) {
        const pt = spherePoints[i];

        // Rotate around Y axis
        const rotX = pt.x * cosA - pt.z * sinA;
        const rotZ = pt.x * sinA + pt.z * cosA;
        const rotY = pt.y;

        // Perspective factor: z goes from -1 (back) to +1 (front)
        const perspective = cameraDistance / (cameraDistance - rotZ * 0.7);

        // Project strictly 1:1 with no aspect distortion
        const projX = centerX + rotX * radius * perspective;
        const projY = centerY + rotY * radius * perspective;

        // Depth fade: front is brighter & larger, back is dimmer & smaller
        const normalizedZ = (rotZ + 1) * 0.5; // 0 (back) to 1 (front)
        const dotIllumination = Math.max(0, rotX * nlx + rotY * nly + rotZ * nlz);

        // Soft center clearance on front face so emblem typography is 100% crisp & unobstructed
        const distFromCenter = Math.hypot(rotX, rotY);
        let centerClearance = 1.0;
        if (rotZ > 0.1 && distFromCenter < 0.35) {
          centerClearance = Math.max(0.18, distFromCenter / 0.35);
        }

        // Base size: 0.7px to 2.2px
        let size = (0.65 + normalizedZ * 1.35 + dotIllumination * 0.4) * perspective * 0.75 * (0.8 + centerClearance * 0.2);
        // Base alpha: 0.18 (back) to 0.92 (front)
        let alpha = (0.18 + normalizedZ * 0.65 + dotIllumination * 0.22) * centerClearance;

        if (pt.isTwinkler) {
          pt.twinklePhase += pt.twinkleSpeed;
          const twinkle = 0.6 + Math.sin(pt.twinklePhase) * 0.4;
          alpha *= twinkle;
          size *= (0.85 + twinkle * 0.25);
        }

        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.5, size), 0, Math.PI * 2);

        // Ivory-gold tint: front dots warmer champagne gold, back dots soft cream ivory
        if (normalizedZ > 0.6) {
          ctx.fillStyle = `rgba(243, 217, 139, ${Math.min(1, alpha)})`;
        } else {
          ctx.fillStyle = `rgba(247, 242, 231, ${Math.min(1, alpha)})`;
        }
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
