'use client';
// Ambient floating reaction shower (spec 2 / 9.6): emojis rise from the bottom edge and fade out
// between 40% and 50% of the screen height. Drawn on a canvas so a busy room stays smooth.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { EmojiParticle } from '@/lib/types';

interface Particle { emoji: string; x: number; born: number; life: number; drift: number; size: number; fadeAt: number }

export interface EmojiShowerHandle { burst: (particles: EmojiParticle[]) => void }

const MAX_PARTICLES = 400;

export const EmojiShower = forwardRef<EmojiShowerHandle>(function EmojiShower(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const reduceMotion = useRef(false);

  useImperativeHandle(ref, () => ({
    burst(incoming) {
      const now = performance.now();
      incoming.forEach((p, i) => {
        particles.current.push({
          emoji: p.emoji, x: p.x_percent / 100, born: now + i * 25,
          life: reduceMotion.current ? 1200 : 2600 + Math.random() * 900,
          drift: (Math.random() - 0.5) * 0.04, size: 34 + Math.random() * 22,
          fadeAt: 0.4 + Math.random() * 0.1,
        });
      });
      if (particles.current.length > MAX_PARTICLES) particles.current.splice(0, particles.current.length - MAX_PARTICLES);
    },
  }), []);

  useEffect(() => {
    reduceMotion.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (now: number) => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      particles.current = particles.current.filter((p) => now - p.born < p.life);
      for (const p of particles.current) {
        const t = (now - p.born) / p.life;
        if (t < 0) continue;
        // Rise from just below the bottom edge to the fade line, easing out.
        const rise = 1 - (1 - t) * (1 - t);
        const topLimit = 1 - p.fadeAt;
        const y = h * (1.05 - rise * (1.05 - topLimit));
        const x = w * (p.x + p.drift * Math.sin(t * Math.PI * 2));
        ctx.globalAlpha = reduceMotion.current ? 1 - t : t > 0.6 ? (1 - t) / 0.4 : 1;
        ctx.font = `${p.size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        ctx.fillText(p.emoji, x, reduceMotion.current ? h * 0.85 : y);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" />;
});
