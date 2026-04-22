'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LanguageContext';

type LayerDef = {
  index: string;
  titleKey:   'layer_ins_title'  | 'layer_hyg_title'  | 'layer_elec_title';
  subtitleKey:'layer_ins_sub'    | 'layer_hyg_sub'    | 'layer_elec_sub';
  matKey:     'layer_ins_mat'    | 'layer_hyg_mat'    | 'layer_elec_mat';
  descKey:    'layer_ins_desc'   | 'layer_hyg_desc'   | 'layer_elec_desc';
  src: string;
  alt: string;
};

const LAYERS: LayerDef[] = [
  { index: '01', titleKey: 'layer_ins_title',  subtitleKey: 'layer_ins_sub',   matKey: 'layer_ins_mat',  descKey: 'layer_ins_desc',  src: '/product images/teardown insulation.jpg',  alt: 'Vinculum teardown — insulation layers' },
  { index: '02', titleKey: 'layer_hyg_title',  subtitleKey: 'layer_hyg_sub',   matKey: 'layer_hyg_mat',  descKey: 'layer_hyg_desc',  src: '/product images/teardown hygiene.jpg',     alt: 'Vinculum teardown — hygiene components' },
  { index: '03', titleKey: 'layer_elec_title', subtitleKey: 'layer_elec_sub',  matKey: 'layer_elec_mat', descKey: 'layer_elec_desc', src: '/product images/teardown electronics.jpg', alt: 'Vinculum teardown — electronics' },
];

function TeardownLayer({ layer, index }: { layer: LayerDef; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const { t } = useLang();
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? '' : 'md:[&>*:first-child]:order-2'}`}>
      <motion.div
        initial={{ opacity: 0, x: isEven ? -32 : 32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <div className="relative overflow-hidden border border-cryo-border bg-cryo-bg-2" style={{ aspectRatio: '3/4' }}>
          <Image src={layer.src} alt={layer.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div aria-hidden="true" className="absolute -bottom-6 right-0"
          style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 400, color: 'rgba(240,240,240,0.04)', lineHeight: 1, userSelect: 'none' }}>
          {layer.index}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isEven ? 32 : -32 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.25)' }}>
            {t('teardown_layer')} {layer.index}
          </span>
          <div className="w-6 h-px bg-cryo-fg/15" />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.2)' }}>
            {t(layer.subtitleKey)}
          </span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 400, color: 'rgba(240,240,240,0.9)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          {t(layer.titleKey)}
        </h3>

        <motion.div className="w-12 h-px bg-cryo-fg/20"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />

        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.04em', lineHeight: 1.9, color: 'rgba(240,240,240,0.45)', maxWidth: '400px' }}>
          {t(layer.descKey)}
        </p>

        <div className="inline-flex items-center gap-2 border border-cryo-border px-3 py-2 self-start"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.35)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cryo-fg/25 inline-block" />
          {t(layer.matKey)}
        </div>
      </motion.div>
    </div>
  );
}

export default function TeardownSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-8% 0px' });
  const { t } = useLang();

  return (
    <section className="relative py-24 md:py-32 bg-cryo-bg border-t border-cryo-border" aria-label="Material composition and teardown">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <motion.div ref={headerRef} className="flex flex-col gap-3 mb-20 md:mb-28"
          initial={{ opacity: 0, y: 16 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.25)' }}>
            {t('teardown_label')}
          </span>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 400, color: 'rgba(240,240,240,0.9)', letterSpacing: '-0.01em' }}>
            {t('teardown_heading')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-28 md:gap-36">
          {LAYERS.map((layer, i) => (
            <TeardownLayer key={layer.index} layer={layer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
