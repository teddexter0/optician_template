'use client';

import { useEffect, useRef } from 'react';

interface HeroGSAPProps {
  headline: string;
  subHeadline?: string;
  children?: React.ReactNode;
  particleColor?: string;
}

export default function HeroGSAP({
  headline,
  subHeadline,
  children,
  particleColor = '#4ECDC4',
}: HeroGSAPProps) {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // GSAP entrance animation
  useEffect(() => {
    const initGSAP = async () => {
      if (typeof window === 'undefined') return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const chars = headlineRef.current?.querySelectorAll('.hero-char');
      const tl = gsap.timeline({ delay: 0.15 });

      if (chars && chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 70, opacity: 0, rotateX: -90, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.035,
            ease: 'back.out(1.7)',
          }
        );
      }

      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
          '-=0.2'
        );
      }
    };

    initGSAP();
  }, []);

  // Canvas particle animation — floating lens/circle particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
      shape: 'circle' | 'ring';
    };

    const particles: Particle[] = [];
    const MAX = 30;

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 1.0 + 0.3),
      size: Math.random() * 5 + 3,
      opacity: Math.random() * 0.5 + 0.15,
      life: 0,
      maxLife: Math.random() * 200 + 140,
      shape: Math.random() > 0.5 ? 'ring' : 'circle',
    });

    for (let i = 0; i < MAX / 2; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let rafId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      while (particles.length < MAX) particles.push(spawn());

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const alpha =
          p.opacity *
          (lifeRatio < 0.1
            ? lifeRatio * 10
            : lifeRatio > 0.9
            ? (1 - lifeRatio) * 10
            : 1);

        const hex = Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0');

        ctx.beginPath();
        if (p.shape === 'ring') {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = `${particleColor}${hex}`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `${particleColor}${hex}`;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [particleColor]);

  const splitToChars = (text: string) =>
    text.split('').map((ch, i) => (
      <span
        key={i}
        className="hero-char inline-block"
        style={{ display: ch === ' ' ? 'inline' : 'inline-block' }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: 'var(--hero-bg)' }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative circles */}
      <div className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full opacity-10 border-[60px] border-white pointer-events-none" />
      <div className="absolute -right-10 bottom-10 w-[300px] h-[300px] rounded-full opacity-10 border-[40px] border-white pointer-events-none" />

      {/* Content */}
      <div className="section-pad relative z-10 text-white">
        <div
          ref={headlineRef}
          className="font-display text-5xl md:text-7xl leading-tight mb-6"
          style={{ perspective: '800px' }}
          aria-label={headline}
        >
          {splitToChars(headline)}
        </div>

        {subHeadline && (
          <p
            ref={subRef}
            className="text-lg text-white/80 max-w-xl mb-10"
          >
            {subHeadline}
          </p>
        )}

        <div ref={ctaRef}>{children}</div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
