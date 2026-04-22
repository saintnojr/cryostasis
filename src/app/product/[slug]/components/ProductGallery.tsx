'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LanguageContext';

type GalleryImg = { id: string; src: string; alt: string; captionKey: 'img_iso' | 'img_int' | 'img_handle' | 'img_display' };

const GALLERY_IMAGES: GalleryImg[] = [
  { id: '001', src: '/product images/main.jpg',  alt: 'Vinculum — 3/4 isometric view',        captionKey: 'img_iso'     },
  { id: '002', src: '/product images/main1.jpg', alt: 'Vinculum — Interior open view',         captionKey: 'img_int'     },
  { id: '003', src: '/product images/main2.jpg', alt: 'Vinculum — Side detail with handle',    captionKey: 'img_handle'  },
  { id: '004', src: '/product images/main3.jpg', alt: 'Vinculum — Digital status panel',       captionKey: 'img_display' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.23, 1, 0.32, 1] } },
};

export default function ProductGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const { t } = useLang();

  return (
    <section className="relative py-24 md:py-32 bg-cryo-bg border-t border-cryo-border" aria-label="Product gallery">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <motion.div className="flex items-end justify-between mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          ref={ref}
        >
          <div className="flex flex-col gap-3">
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.25)' }}>
              {t('gallery_label')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 400, color: 'rgba(240,240,240,0.9)', letterSpacing: '-0.01em' }}>
              {t('gallery_heading')}
            </h2>
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.2)' }}
            className="hidden md:block">
            4 views
          </span>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          {GALLERY_IMAGES.map(img => (
            <motion.div key={img.id} variants={itemVariants} className="group relative flex flex-col gap-3">
              <div className="relative overflow-hidden bg-cryo-bg-2 border border-cryo-border" style={{ aspectRatio: '3/4' }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-cryo-bg/0 group-hover:bg-cryo-bg/20 transition-colors duration-500" aria-hidden="true" />
                <div className="absolute top-3 left-3"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.18em', color: 'rgba(240,240,240,0.35)', textTransform: 'uppercase' }}>
                  {img.id}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.3)' }}>
                  {t(img.captionKey)}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p className="mt-12 text-cryo-fg/20"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.6 }}
          style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.1em', lineHeight: 1.9 }}>
          {t('gallery_note')}
        </motion.p>
      </div>
    </section>
  );
}
