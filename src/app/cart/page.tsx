'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

// Инициализируем Stripe вне компонента
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const rowIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.3 + i * 0.08 },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.28, ease: 'easeIn' } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.1 },
  }),
};

function EmptyCart() {
  const { t } = useLang();
  return (
    <motion.div className="flex flex-col items-center justify-center py-40 gap-8"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
    >
      <pre aria-hidden="true" className="text-cryo-fg/10 leading-tight select-none"
        style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.08em' }}
      >{`   . . . . . . . . . .
  .                 .
  .                 .
  .      empty      .
  .                 .
  . . . . . . . . . .`}</pre>
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-cryo-fg/60" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 400 }}>
          {t('cart_empty_title')}
        </h2>
        <p className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {t('cart_empty_sub')}
        </p>
      </div>
      <Link href="/product/vinculum" className="explore-btn">{t('cart_view')}</Link>
    </motion.div>
  );
}

export default function CartPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();
  const { t } = useLang();

  const isEmpty = items.length === 0;

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleCheckout = async (paymentId: string) => {
    const user = auth.currentUser;

    // Если пользователь не авторизован (хотя StripeForm не должен был показаться)
    if (!user) {
      router.push('/login?redirect=cart');
      return;
    }

    setIsProcessing(true);

    try {
      const ordersRef = collection(db, 'orders');

      const orderData = {
        userId: user.uid,
        paymentId: paymentId, // Сохраняем ID транзакции из Stripe
        items: items.map(item => ({
          sku: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        subtotal: subtotal,
        currency: 'USD',
        status: 'paid', // Устанавливаем статус "оплачено"
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Записываем в Firestore
      const docRef = await addDoc(ordersRef, orderData);

      // Очищаем корзину в контексте
      if (clearCart) clearCart();

      // Устанавливаем локальное состояние успеха для UI
      setOrderId(docRef.id);
      setIsSuccess(true);

    } catch (error) {
      console.error("Firebase Order creation error:", error);
      alert("Payment successful, but order recording failed. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <GrainOverlay />
      <Header />
      <main className="relative min-h-screen animated-gradient-bg overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(240,240,240,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,240,240,0.025) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 pt-32 pb-24">

          <motion.div className="mb-16 pb-8 border-b border-cryo-border" custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span className="text-cryo-fg/25 block mb-3" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              {isSuccess ? t('cart_summary') : t('cart_label')}
            </span>
            <h1 className="text-cryo-fg" style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
              {isSuccess ? 'Success' : isEmpty ? t('cart_empty_title') : t('cart_your_order')}
            </h1>
          </motion.div>

          {isSuccess ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20 gap-8 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-cryo-fg/80" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.75rem', fontWeight: 400 }}>
                  Order Confirmed
                </h2>
                <p className="text-cryo-fg/40" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Reference ID: <span className="text-cryo-fg/60 ml-2 select-all">{orderId}</span>
                </p>
              </div>
              <p className="max-w-md text-cryo-fg/30" style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', lineHeight: 1.8, letterSpacing: '0.04em' }}>
                Your request is being processed. A confirmation details will be available in your dashboard shortly.
              </p>
              <Link href="/product/vinculum" className="explore-btn mt-4">
                Continue Exploration
              </Link>
            </motion.div>
          ) : isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-16 items-start">
              <div className="flex flex-col">
                <motion.div className="hidden md:grid grid-cols-[1fr,120px,120px,40px] gap-4 pb-4 border-b border-cryo-border mb-1" custom={0} variants={fadeUp} initial="hidden" animate="visible">
                  {[t('nav_product'), t('pp_quantity'), 'Price', ''].map((h, i) => (
                    <span key={i} className="text-cryo-fg/20" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </motion.div>

                <AnimatePresence initial={false}>
                  {items.map((item, i) => (
                    <motion.div key={item.id} custom={i} variants={rowIn} initial="hidden" animate="visible" exit="exit" layout
                      className="grid grid-cols-1 md:grid-cols-[1fr,120px,120px,40px] gap-4 items-center py-8 border-b border-cryo-border">
                      <div className="flex flex-col gap-1">
                        <span className="text-cryo-fg/80" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 400 }}>{item.name}</span>
                        <span className="text-cryo-fg/30" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em' }}>{item.subtitle}</span>
                      </div>
                      <div className="flex items-center border border-cryo-border self-start md:self-center w-fit">
                        <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-cryo-fg/35 hover:text-cryo-fg/80 hover:bg-cryo-fg/5 transition-colors" style={{ fontSize: '14px' }}>−</button>
                        <AnimatePresence mode="wait">
                          <motion.div key={item.qty} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
                            className="w-10 h-9 flex items-center justify-center border-x border-cryo-border" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.6)' }}>
                            {String(item.qty).padStart(2, '0')}
                          </motion.div>
                        </AnimatePresence>
                        <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center text-cryo-fg/35 hover:text-cryo-fg/80 hover:bg-cryo-fg/5 transition-colors" style={{ fontSize: '14px' }}>+</button>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div key={item.qty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                          className="hidden md:flex items-center" style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', letterSpacing: '0.06em', color: 'rgba(240,240,240,0.55)' }}>
                          ${(item.price * item.qty).toLocaleString()}
                        </motion.div>
                      </AnimatePresence>
                      <button onClick={() => removeItem(item.id)} className="text-cryo-fg/20 hover:text-cryo-fg/60 transition-colors self-start md:self-center"
                        style={{ fontSize: '16px', lineHeight: 1, background: 'none', border: 'none', padding: 0 }}>×</button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.div className="mt-10" custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  <Link href="/product/vinculum" className="text-cryo-fg/30 hover:text-cryo-fg/70 transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    {t('cart_continue')}
                  </Link>
                </motion.div>
              </div>

              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                style={{ background: 'rgba(10,10,10,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(240,240,240,0.08)' }}>
                <div className="px-8 py-10 flex flex-col gap-6">
                  <span className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    {t('cart_summary')}
                  </span>
                  <div className="flex flex-col gap-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-baseline justify-between gap-4">
                        <span className="text-cryo-fg/40 truncate" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.06em' }}>{item.name} × {item.qty}</span>
                        <AnimatePresence mode="wait">
                          <motion.span key={item.qty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                            className="text-cryo-fg/55 flex-shrink-0" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.06em' }}>
                            ${(item.price * item.qty).toLocaleString()}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-baseline justify-between border-t border-cryo-border pt-4">
                    <span className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em' }}>{t('cart_shipping')}</span>
                    <span className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em' }}>{t('cart_ship_calc')}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-cryo-border pt-5">
                    <span className="text-cryo-fg/50" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t('pp_total')}</span>
                    <AnimatePresence mode="wait">
                      <motion.span key={subtotal} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}
                        className="text-cryo-fg/90" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', fontWeight: 400 }}>
                        ${subtotal.toLocaleString()}
                        <span className="text-cryo-fg/30 ml-2" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em' }}>USD</span>
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Контейнер для оплаты */}
                  <div className="mt-2">
                    <Elements
                      stripe={stripePromise}
                      options={{
                        appearance: {
                          theme: 'night',
                          variables: {
                            colorPrimary: '#f0f0f0',
                            colorBackground: 'transparent',
                            colorText: '#f0f0f0',
                            fontFamily: 'var(--font-ui)'
                          }
                        }
                      }} >

                      <CheckoutForm
                        amount={subtotal}
                        isProcessing={isProcessing}
                        onSuccess={(paymentId) => handleCheckout(paymentId)}
                      />
                    </Elements>
                  </div>

                  <button className="w-full py-3.5 mt-4 text-cryo-fg/30 hover:text-cryo-fg/60 transition-colors duration-200 border border-cryo-border hover:border-cryo-fg/20"
                    style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none' }}>
                    {t('cart_quote')}
                  </button>

                  <p className="mt-6" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.06em', lineHeight: 1.9, color: 'rgba(240,240,240,0.18)', whiteSpace: 'pre-line' }}>
                    {t('cart_lead')}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div >
      </main >
      <Footer />
    </>
  );
}