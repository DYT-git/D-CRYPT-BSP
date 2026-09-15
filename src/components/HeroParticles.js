'use client';
import { useEffect, useRef } from 'react';

/**
 * HeroParticles: Zero-lag, GPU-assisted lightweight ambient particle engine.
 * - Automatically throttles particle count on mobile (8 vs 16)
 * - Pauses execution when hero is out of view (IntersectionObserver)
 * - Morning/Afternoon: Drifting Kashful petals & sunlit golden dust
 * - Evening: Rising golden diya embers & celestial fireflies
 */
export default function HeroParticles({ timeOfDay = 'morning' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId = null;
    let isVisible = true;
    const isEvening = timeOfDay === 'evening';

    // Scale canvas to device resolution (cap DPR at 1.5 for performance)
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Mobile vs Desktop particle quota
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 16;

    // Initialize particles
    const particles = Array.from({ length: count }, () => createParticle(width, height, isEvening, true));

    function createParticle(w, h, evening, initial = false) {
      const type = Math.random() > 0.4 ? (evening ? 'ember' : 'kashful') : 'dust';
      return {
        type,
        x: Math.random() * (w || 1000),
        y: initial ? Math.random() * (h || 600) : (evening ? (h || 600) + 15 : -15),
        size: type === 'kashful' ? (Math.random() * 8 + 8) : (Math.random() * 2.5 + 1.2),
        speedX: (Math.random() - 0.45) * 0.4 + (evening ? 0 : 0.25),
        speedY: evening ? -(Math.random() * 0.5 + 0.25) : (Math.random() * 0.45 + 0.3),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        alpha: Math.random() * 0.4 + (evening ? 0.25 : 0.2),
        baseAlpha: Math.random() * 0.3 + 0.25,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.01,
      };
    }

    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!isVisible) return;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.phase += p.phaseSpeed;
        p.rotation += p.rotSpeed;

        // Oscillating natural motion
        const sway = Math.sin(p.phase) * (p.type === 'kashful' ? 0.4 : 0.2);
        p.x += p.speedX + sway;
        p.y += p.speedY;

        // Twinkle / pulse alpha
        p.alpha = p.baseAlpha + Math.sin(p.phase * 1.5) * 0.15;

        // Draw based on particle type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'kashful') {
          // Delicate elongated silken Kashful floret
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.45, p.size * 1.4, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 252, 242, ${Math.max(0, p.alpha * 0.65)})`;
          ctx.fill();

          // Soft inner stem highlight
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.2, p.size * 0.8);
          ctx.lineTo(p.size * 0.3, -p.size * 0.8);
          ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, p.alpha * 0.4)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        } else if (p.type === 'ember') {
          // Warm glowing golden diya ember
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          grad.addColorStop(0, `rgba(254, 240, 138, ${p.alpha * 0.95})`);
          grad.addColorStop(0.4, `rgba(251, 191, 36, ${p.alpha * 0.7})`);
          grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Golden sunbeam dust mote
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isEvening
            ? `rgba(251, 191, 36, ${Math.max(0, p.alpha * 0.8)})`
            : `rgba(245, 158, 11, ${Math.max(0, p.alpha * 0.55)})`;
          ctx.fill();
        }

        ctx.restore();

        // Respawn when out of view
        if (isEvening) {
          if (p.y < -20 || p.x < -30 || p.x > width + 30) {
            particles[i] = createParticle(width, height, isEvening, false);
          }
        } else {
          if (p.y > height + 20 || p.x < -30 || p.x > width + 30) {
            particles[i] = createParticle(width, height, isEvening, false);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    // Pause canvas when out of viewport (IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        } else if (animId) {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas.parentElement || canvas);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [timeOfDay]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15 select-none"
      aria-hidden="true"
    />
  );
}
