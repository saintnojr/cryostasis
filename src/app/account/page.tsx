'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: i * 0.1 },
  }),
};

export default function AccountPage() {
  const cursorRef              = useRef<HTMLDivElement>(null);
  const { user, logout, loading } = useAuth();
  const { t }                  = useLang();
  const router                 = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) router.replace('/auth');
  }, [user, loading, router]);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e: MouseEvent) => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Show nothing while resolving auth state
  if (loading || !user) return null;

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'User';
  const email       = user.email ?? '';
  const provider    = user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email';
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <GrainOverlay />
      <Header />

      <main className="relative min-h-screen animated-gradient-bg overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(to right, rgba(240,240,240,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(240,240,240,0.025) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 pt-32 pb-24">

          {/* Page header */}
          <motion.div className="mb-16 pb-8 border-b border-cryo-border" custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span className="text-cryo-fg/25 block mb-3" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              00 — Account
            </span>
            <h1 className="text-cryo-fg" style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 400, letterSpacing: '-0.01em' }}>
              Your profile.
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,360px] gap-12 items-start">

            {/* Left — profile info */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-8">

              {/* Avatar + name */}
              <div className="flex items-center gap-6 pb-8 border-b border-cryo-border">
                <div
                  className="w-16 h-16 border border-cryo-border flex items-center justify-center flex-shrink-0"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '18px', letterSpacing: '0.05em', color: 'rgba(240,240,240,0.5)' }}
                >
                  {initials}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-cryo-fg/80" style={{ fontFamily: 'var(--font-headline)', fontSize: '1.5rem', fontWeight: 400 }}>
                    {displayName}
                  </h2>
                  <p className="text-cryo-fg/30" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em' }}>
                    {email}
                  </p>
                </div>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-0">
                {[
                  { label: 'UID',      value: user.uid           },
                  { label: 'Provider', value: provider           },
                  { label: 'Email',    value: email              },
                  { label: 'Name',     value: displayName        },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-baseline justify-between py-4 border-b border-cryo-border">
                    <span className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                      {label}
                    </span>
                    <span className="text-cryo-fg/55 max-w-xs truncate text-right" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.06em' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — actions panel */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              style={{
                background: 'rgba(10,10,10,0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(240,240,240,0.08)',
              }}
            >
              <div className="px-8 py-10 flex flex-col gap-6">
                <span className="text-cryo-fg/25" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                  Actions
                </span>

                <button
                  onClick={() => router.push('/product/vinculum')}
                  className="w-full py-4 border border-cryo-border hover:border-cryo-fg/25 hover:bg-cryo-fg/[0.04] transition-all duration-300 flex items-center justify-center gap-3"
                  style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.45)', background: 'none' }}
                >
                  <UserIcon className="w-4 h-4" strokeWidth={1.5} />
                  {t('nav_product')}
                </button>

                <button
                  onClick={handleLogout}
                  className="explore-btn w-full flex items-center justify-center gap-3"
                  style={{ display: 'flex' }}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" strokeWidth={1.5} />
                  Sign out
                </button>

                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.06em', lineHeight: 1.9, color: 'rgba(240,240,240,0.18)' }}>
                  Your session is secured by Firebase Authentication.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
