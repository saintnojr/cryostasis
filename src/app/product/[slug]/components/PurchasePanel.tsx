'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';
import { useProduct } from '@/hooks/useProduct';
import { PRODUCT_SLUG } from '@/constants/navigation';

const PRODUCT_SKU = `CRYO-${PRODUCT_SLUG.toUpperCase()}-01`;

export default function PurchasePanel() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem }                   = useCart();
  const { t }                         = useLang();
  const { product, loading, error }   = useProduct(PRODUCT_SKU);
  const router                        = useRouter();

  // All values come from Firestore — no hardcode
  const price    = product?.price    ?? null;
  const name     = product?.name     ?? '—';
  const subtitle = product?.subtitle ?? t('pp_subtitle');
  const currency = product?.currency ?? 'USD';

  const handleAdd = () => {
    if (!product) return;
    addItem({
      id:       product.sku,
      name:     product.name,
      subtitle: product.subtitle,
      price:    product.price,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleGoCart = () => router.push('/cart');

  const inBoxItems = [
    t('pp_item1'), t('pp_item2'), t('pp_item3'), t('pp_item4'), t('pp_item5'),
  ];

  return (
    <section className="relative py-24 md:py-32 bg-cryo-bg-2 border-t border-cryo-border" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">

        {/* Section heading */}
        <motion.div className="flex flex-col gap-3 mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="font-ui text-[9px] tracking-[0.22em] uppercase text-white/25">
            {t('pp_label')}
          </span>
          <h2 className="font-headline text-[clamp(1.4rem,3vw,2.4rem)] font-normal text-white/90 tracking-tight">
            {t('pp_heading')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left — product info */}
          <motion.div className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            <div className="flex flex-col gap-2 pb-8 border-b border-cryo-border">
              <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-white/25">{t('pp_brand')}</span>
              <h3 className="font-headline text-[clamp(1.8rem,4vw,3rem)] font-normal text-white/90 tracking-tight">
                {name}
              </h3>
              <p className="font-ui text-[10px] tracking-wider text-white/35 leading-loose">
                {subtitle}
              </p>
            </div>

            {/* In the box */}
            <div className="flex flex-col gap-3">
              <span className="font-ui text-[8px] tracking-[0.22em] uppercase text-white/20">{t('pp_inbox')}</span>
              {inBoxItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                  <span className="font-ui text-[10px] tracking-wider text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — order form */}
          <motion.div className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          >
            {/* Price */}
            <div className="flex flex-col gap-1 pb-8 border-b border-cryo-border">
              <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-white/25">{t('pp_unit_price')}</span>
              <div className="flex items-baseline gap-3">
                {loading ? (
                  <span className="font-ui text-[13px] text-white/20 tracking-widest">Loading…</span>
                ) : error ? (
                  <span className="font-ui text-[11px] text-red-400/60 tracking-wider">—</span>
                ) : (
                  <>
                    <span className="font-headline text-[clamp(1.8rem,4vw,3rem)] font-normal text-white/90">
                      ${price?.toLocaleString()}
                    </span>
                    <span className="font-ui text-[9px] tracking-widest text-white/25 uppercase">{t('pp_usd')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex flex-col gap-3">
              <span className="font-ui text-[8px] tracking-[0.22em] uppercase text-white/25">{t('pp_quantity')}</span>
              <div className="flex items-center gap-0 border border-cryo-border self-start">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors">−</button>
                <div className="w-12 h-10 flex items-center justify-center border-x border-cryo-border font-ui text-[11px] text-white/70">
                  {String(qty).padStart(2, '0')}
                </div>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors">+</button>
              </div>
            </div>

            {/* Total */}
            {price !== null && (
              <div className="flex items-baseline justify-between py-4 border-t border-b border-cryo-border">
                <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-white/30">{t('pp_total')}</span>
                <AnimatePresence mode="wait">
                  <motion.span key={qty}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="font-ui text-[13px] tracking-wider text-white/70"
                  >
                    ${(price * qty).toLocaleString()} {currency}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              {/* Add to cart */}
              <motion.button
                onClick={handleAdd}
                disabled={loading || !product}
                className="w-full py-4 border border-white/25 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300 uppercase text-[11px] tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span key={added ? 'added' : 'add'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    {added ? t('pp_added') : t('pp_add')}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Go to cart */}
              <button
                onClick={handleGoCart}
                className="w-full py-4 bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center uppercase text-[11px] tracking-[0.2em] font-medium"
              >
                {t('pp_checkout')}
              </button>
            </div>

            <p className="font-ui text-[9px] tracking-wider text-white/20 leading-relaxed italic">
              {t('pp_lead')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
