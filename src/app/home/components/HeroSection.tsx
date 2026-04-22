'use client';

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useHeroExit } from '@/context/HeroExitContext';
import { useLang }     from '@/context/LanguageContext';

/* ─── ASCII charset: darkest → lightest ───────────────────────────────────── */
const CHARSET = '@#S%?*+;:,. ';

/* ─── Cell size in CSS px ─────────────────────────────────────────────────── */
const CELL_W = 6;
const CELL_H = 10;

/* ─── Timing ──────────────────────────────────────────────────────────────── */
const INTRO_MS = 1500;
const OUTRO_MS =  750;

/* ─── Easing ──────────────────────────────────────────────────────────────── */
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInCubic(t: number)  { return t * t * t; }

/* ═══════════════════════════════════════════════════════════════════════════
   ASCII HAND CANVAS

   Pipeline per frame:
     1. Draw the PNG onto `intermediate` canvas at its current animated
        position (translate by offsetX). The intermediate canvas is always
        the same size as the display area so pixel coords match 1-to-1.
     2. Read pixels from `intermediate` via getImageData.
     3. Walk the ASCII grid — each cell samples one pixel from the
        intermediate canvas at that cell's screen position.
     4. Draw the character on the display canvas. The grid is stationary;
        characters change because the underlying image moved.
═══════════════════════════════════════════════════════════════════════════ */

type Phase = 'intro' | 'idle' | 'outro';

interface AsciiHandCanvasProps {
  src:          string;
  side:         'left' | 'right';
  phase:        Phase;
  onOutroDone?: () => void;
}

function AsciiHandCanvas({ src, side, phase, onOutroDone }: AsciiHandCanvasProps) {
  const displayRef     = useRef<HTMLCanvasElement>(null);
  // Intermediate canvas — same logical size as display, redrawn every frame
  const interRef       = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const imgRef         = useRef<HTMLImageElement | null>(null);
  const phaseRef       = useRef<Phase>('intro');
  const progressRef    = useRef(0);
  const startTsRef     = useRef(0);
  const rafRef         = useRef(0);
  const doneRef        = useRef(false);

  /* Load image */
  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = src;
  }, [src]);

  /* Sync phase prop → ref */
  useEffect(() => {
    if (phase === 'outro' && phaseRef.current !== 'outro') {
      phaseRef.current   = 'outro';
      startTsRef.current = 0;
      doneRef.current    = false;
    }
  }, [phase]);

  /* Animation loop */
  useEffect(() => {
    const display = displayRef.current;
    if (!display) return;

    const inter    = interRef.current;
    const interCtx = inter.getContext('2d', { willReadFrequently: true })!;
    const dispCtx  = display.getContext('2d')!;
    let dpr        = devicePixelRatio;
    let stopped    = false;

    function setSize() {
    // Если display равен null, выходим из функции
    if (!display) return; 

    dpr = window.devicePixelRatio; // лучше использовать window.
    
    display.width = display.offsetWidth * dpr;
    display.height = display.offsetHeight * dpr;
    
    inter.width = display.offsetWidth;
    inter.height = display.offsetHeight;
    }
    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(display);

    function frame(ts: number) {
    if (stopped || !display) return; // Добавляем проверку здесь

    const logW = display.offsetWidth;
    const logH = display.offsetHeight;
    const img = imgRef.current;

      // ── 1. Update progress ────────────────────────────────────────────────
      const ph = phaseRef.current;

      if (ph === 'intro') {
        if (startTsRef.current === 0) startTsRef.current = ts;
        const t = Math.min((ts - startTsRef.current) / INTRO_MS, 1);
        progressRef.current = easeOutCubic(t);
        if (t >= 1) { phaseRef.current = 'idle'; progressRef.current = 1; }
      } else if (ph === 'idle') {
        progressRef.current = 1;
      } else if (ph === 'outro') {
        if (startTsRef.current === 0) startTsRef.current = ts;
        const t = Math.min((ts - startTsRef.current) / OUTRO_MS, 1);
        progressRef.current = 1 - easeInCubic(t);
        if (t >= 1) {
          progressRef.current = 0;
          if (!doneRef.current) { doneRef.current = true; onOutroDone?.(); }
          stopped = true;
          return;
        }
      }

      // ── 2. Draw moving image onto intermediate canvas ─────────────────────
      interCtx.clearRect(0, 0, logW, logH);

      if (img && progressRef.current > 0) {
        const p = progressRef.current;

        // Эти три параметра теперь полностью контролируют положение рук:
        const SCALE_BOOST = 1.4; // Если по бокам пусто — ставь 1.6 или 1.8
        const Y_OFFSET = 140;    // Если руки выше кнопки — увеличивай (например, до 150)
        const X_OFFSET = -110;    // Если между пальцами дырка — увеличивай до 60-80

        const scale = (logH / img.naturalHeight) * SCALE_BOOST;
        const drawW = img.naturalWidth  * scale;
        const drawH = img.naturalHeight * scale;
        
        // Вертикальная позиция
        const drawY = ((logH - drawH) / 2) + Y_OFFSET;

        // Горизонтальная позиция (якорь на центр экрана)
        const anchorX = side === 'left'
          ? logW / 2 - drawW + X_OFFSET
          : logW / 2 - X_OFFSET;

        // Анимация выезда (Slide)
        const offPx   = logW * (1 - p);
        const offsetX = side === 'left' ? -offPx : offPx;

        interCtx.save();
        interCtx.translate(offsetX, 0);
        interCtx.drawImage(img, anchorX, drawY, drawW, drawH);
        interCtx.restore();
      }

      // ── 3. Read pixels & render ASCII grid onto display canvas ────────────
      dispCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dispCtx.clearRect(0, 0, logW, logH);

      if (progressRef.current > 0 && logW > 0 && logH > 0) {
        const { data } = interCtx.getImageData(0, 0, logW, logH);

        const cols   = Math.ceil(logW / CELL_W);
        const rows   = Math.ceil(logH / CELL_H);
        const opacity = 0.55 + progressRef.current * 0.35;

        dispCtx.save();
        dispCtx.globalAlpha  = opacity;
        dispCtx.font         = `${CELL_H}px "IBM Plex Mono", monospace`;
        dispCtx.fillStyle    = '#F0F0F0';
        dispCtx.textBaseline = 'top';

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            // Sample the centre of each cell in the intermediate canvas
            const sx = Math.min(Math.floor(col * CELL_W + CELL_W / 2), logW - 1);
            const sy = Math.min(Math.floor(row * CELL_H + CELL_H / 2), logH - 1);
            const i  = (sy * logW + sx) * 4;

            const a = data[i + 3] / 255;
            if (a < 0.06) continue;

            const lum  = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
            const bri  = lum * a + (1 - a);
            const idx  = Math.floor((1 - bri) * (CHARSET.length - 1));
            const char = CHARSET[Math.max(0, Math.min(CHARSET.length - 1, idx))];

            dispCtx.fillText(char, col * CELL_W, row * CELL_H);
          }
        }

        dispCtx.restore();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    // Kick off
    phaseRef.current    = 'intro';
    startTsRef.current  = 0;
    progressRef.current = 0;
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side]);

  return (
    <canvas
      ref={displayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full block"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR SPOTLIGHT
═══════════════════════════════════════════════════════════════════════════ */
function CursorSpotlight() {
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const bgX = useTransform(springX, v => `${v}px`);
  const bgY = useTransform(springY, v => `${v}px`);
  useEffect(() => {
    const mv = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', mv);
    return () => window.removeEventListener('mousemove', mv);
  }, [mouseX, mouseY]);
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <motion.div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ x: bgX, y: bgY, translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(240,240,240,0.028) 0%, transparent 70%)' }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACKGROUND BLOBS
═══════════════════════════════════════════════════════════════════════════ */
function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div className="absolute rounded-full"
        style={{ width:500, height:500, top:'-10%', left:'-8%', background:'radial-gradient(circle, rgba(255,255,255,0.022) 0%, transparent 70%)', filter:'blur(60px)' }}
        animate={{ x:[0,18,0], y:[0,-12,0] }} transition={{ duration:18, repeat:Infinity, ease:'easeInOut' }} />
      <motion.div className="absolute rounded-full"
        style={{ width:600, height:600, bottom:'-15%', right:'-10%', background:'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 70%)', filter:'blur(80px)' }}
        animate={{ x:[0,-20,0], y:[0,16,0] }} transition={{ duration:22, repeat:Infinity, ease:'easeInOut', delay:3 }} />
      <motion.div className="absolute rounded-full"
        style={{ width:300, height:300, top:'40%', left:'50%', translateX:'-50%', translateY:'-50%', background:'radial-gradient(circle, rgba(255,255,255,0.012) 0%, transparent 70%)', filter:'blur(40px)' }}
        animate={{ opacity:[0.4,0.9,0.4] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut', delay:1 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
};
const fadeUpVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] } },
};

export default function HeroSection() {
  const router            = useRouter();
  const { register }      = useHeroExit();
  const { t }             = useLang();
  const [phase, setPhase] = useState<Phase>('intro');

  /* Count how many canvas outro callbacks fired (need both L+R) */
  const doneCount = useRef(0);
  /* Promise resolver stored during outro */
  const resolveRef = useRef<(() => void) | null>(null);

  /* Called by each AsciiHandCanvas when its outro finishes */
  const handleOutroDone = useCallback(() => {
    doneCount.current += 1;
    if (doneCount.current >= 2) {
      resolveRef.current?.();
      resolveRef.current = null;
      doneCount.current  = 0;
    }
  }, []);

  /* Trigger outro, wait for both canvases, then return */
  const triggerOutro = useCallback((): Promise<void> => {
    return new Promise(resolve => {
      doneCount.current = 0;
      resolveRef.current = resolve;
      setPhase('outro');
      /* Safety fallback if images never loaded */
      setTimeout(() => { resolveRef.current?.(); resolveRef.current = null; }, OUTRO_MS + 300);
    });
  }, []);

  /* Register with context so Header can call it */
  useEffect(() => {
    register(triggerOutro);
  }, [register, triggerOutro]);

  /* Explore button */
  const handleExplore = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    await triggerOutro();
    router.push('/product/vinculum');
  }, [triggerOutro, router]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" aria-label="Hero">

      <BackgroundBlobs />
      <CursorSpotlight />

      {/* Swiss grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(240,240,240,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,240,240,0.025) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* ASCII Hands layer — both full-screen, fingers meet at centre */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {/* Right hand behind left so left fingers are on top at centre */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <AsciiHandCanvas src="/hands/righthand.png" side="right" phase={phase} onOutroDone={handleOutroDone} />
        </div>
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <AsciiHandCanvas src="/hands/lefthand.png" side="left"  phase={phase} onOutroDone={handleOutroDone} />
        </div>
      </div>

      {/* Content */}
      <motion.div className="relative z-10 flex flex-col items-center text-center px-6"
        variants={containerVariants} initial="hidden" animate="visible">

        <motion.h1 variants={fadeUpVariant} className="text-cryo-fg leading-tight md:leading-snug"
          style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 4.5vw, 3.6rem)', fontWeight: 400, letterSpacing: '0.01em', maxWidth: '720px' }}>
          {t('hero_tagline')}
        </motion.h1>

        <motion.div variants={fadeUpVariant} className="mt-14">
          <button onClick={handleExplore} className="explore-btn" aria-label="Explore CryoStasis product" >
            {t('hero_explore')}
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom meta */}
      <motion.div className="absolute bottom-10 left-0 right-0 z-10 flex items-center justify-center gap-8 text-cryo-fg/20"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 1.4 }}
        style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        <span>EST. 2026</span>
        <span className="w-4 h-px bg-cryo-fg/15 inline-block" />
        <span>ALMATY · KAZAKHSTAN</span>
        <span className="w-4 h-px bg-cryo-fg/15 inline-block" />
        <span>ISO 13485</span>
      </motion.div>

      <div className="absolute bottom-8 left-6 md:left-10 text-cryo-fg/15 hidden md:block" aria-hidden
        style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.8 }}>
        <p>43°14′N 76°56′E</p>
      </div>
      <div className="absolute bottom-8 right-6 md:right-10 text-cryo-fg/15 text-right hidden md:block" aria-hidden
        style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1.8 }}>
        <p>Cryo-01 / Transport</p>
        <p>System_v1.0.0</p>
      </div>
    </section>
  );
}
