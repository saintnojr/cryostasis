'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useLang } from '@/context/LanguageContext';

/* ─── Cursor spotlight ─── */
function CursorSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const bgX = useTransform(springX, (v) => `${v}px`);
  const bgY = useTransform(springY, (v) => `${v}px`);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    >
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          x: bgX,
          y: bgY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(240,240,240,0.022) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

export default function ProductHero() {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cryo-bg"
      aria-label="Vinculum product hero"
    >
      <CursorSpotlight />

      {/* ── Subtle Swiss grid lines ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(240,240,240,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(240,240,240,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-10 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-0 min-h-[80vh]">

          {/* ── Left: Product identity ── */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col justify-center gap-6 md:pr-12"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          >
            <div
              className="flex items-center gap-3"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,240,0.3)',
              }}
            >
              <span className="w-6 h-px bg-cryo-fg/20 inline-block" />
              <span>{t('ph_label')}</span>
            </div>

            <h1
              className="text-cryo-fg"
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.0,
              }}
            >
              Vinculum
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                lineHeight: 1.8,
                color: 'rgba(240,240,240,0.45)',
                maxWidth: '260px',
                whiteSpace: 'pre-line',
              }}
            >
              {t('ph_subtitle')}
            </p>

            <motion.div
              className="w-full h-px bg-cryo-fg/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.8 }}
              style={{ transformOrigin: 'left' }}
            />

            <div
              className="flex items-center gap-5"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,240,0.25)',
              }}
            >
              <span>ISO 13485</span>
              <span className="w-1 h-1 rounded-full bg-cryo-fg/15 inline-block" />
              <span>CE Marked</span>
              <span className="w-1 h-1 rounded-full bg-cryo-fg/15 inline-block" />
              <span>UN3373</span>
            </div>
          </motion.div>

          {/* ── Center: Product image ── */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(240,240,240,0.06) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Float animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <Image
                src="/product images/main.png"
                alt="Vinculum — Cryogenic Organ Transport Case"
                width={520}
                height={580}
                priority
                className="relative z-10 drop-shadow-2xl"
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>

          {/* ── Right: Technical metadata ── */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col justify-center gap-5 md:pl-12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
          >
            {[
              { labelKey: 'ph_temp',     value: '−196 °C' },
              { labelKey: 'ph_battery',  value: '72 h' },
              { labelKey: 'ph_weight',   value: '4.2 kg' },
              { labelKey: 'ph_material', value: 'ABS / EPS / SS' },
              { labelKey: 'ph_cooling',  value: '003 — Cryo' },
            ].map(({ labelKey, value }) => (
              <div key={labelKey} className="flex flex-col gap-1">
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '8px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(240,240,240,0.25)',
                  }}
                >
                  {t(labelKey as Parameters<typeof t>[0])}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    color: 'rgba(240,240,240,0.75)',
                  }}
                >
                  {value}
                </span>
                <div className="w-full h-px bg-cryo-fg/[0.06]" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom meta row ── */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 1.2 }}
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(240,240,240,0.18)',
        }}
      >
        <span>Cryo-01 / Transport</span>
        <span className="w-4 h-px bg-cryo-fg/10 inline-block" />
        <span>System_v1.0.0</span>
        <span className="w-4 h-px bg-cryo-fg/10 inline-block" />
        <span>P023782B</span>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 right-8 md:right-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        aria-hidden="true"
      >
        <motion.div
          className="w-px h-10 bg-cryo-fg/20"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(240,240,240,0.2)',
            writingMode: 'vertical-rl',
          }}
        >
          {t('ph_scroll')}
        </span>
      </motion.div>
    </section>
  );
}
