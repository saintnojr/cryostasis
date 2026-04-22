'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import AsciiHeart from './components/AsciiHeart';
import { useLang } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const inputClass =
  'w-full bg-transparent border border-cryo-border focus:border-cryo-fg/40 ' +
  'px-4 py-3 text-cryo-fg text-[13px] placeholder:text-cryo-fg/20 ' +
  'focus:outline-none transition-colors duration-200';

const labelClass = 'block text-[9px] uppercase tracking-[0.22em] text-cryo-fg/30 mb-2.5';

const formSwitch = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.22, ease: 'easeIn' } },
};

const fieldIn = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: i * 0.07 },
  }),
};

export default function AuthPage() {
  const cursorRef               = useRef<HTMLDivElement>(null);
  const [mode, setMode]         = useState<'in' | 'up'>('in');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [displayName, setDisplayName] = useState('');

  const { t }                              = useLang();
  const { signIn, signUp, signInGoogle, error, loading, clearError, user } = useAuth();
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    if (user) router.replace('/account');
  }, [user, router]);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e: MouseEvent) => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const resetFields = () => { setEmail(''); setPassword(''); setConfirm(''); setDisplayName(''); clearError(); };
  const switchMode = () => { setMode(m => m === 'in' ? 'up' : 'in'); resetFields(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'in') {
      await signIn(email, password);
    } else {
      if (password !== confirm) return;
      await signUp(email, password, displayName || undefined);
    }
  };

  const handleGoogle = async () => {
    await signInGoogle();
  };

  const passwordMismatch = mode === 'up' && confirm.length > 0 && password !== confirm;

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

        <div className="relative z-10 min-h-screen pt-14">
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 min-h-[calc(100vh-56px)] flex items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-center py-16">

              {/* LEFT — ASCII Heart */}
              <motion.div aria-hidden="true"
                className="hidden md:flex items-center justify-start overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1] }}
                style={{ minHeight: '520px' }}
              >
                <div style={{ marginLeft: '-32px', flexShrink: 0 }}>
                  <AsciiHeart />
                </div>
              </motion.div>

              {/* RIGHT — Glass panel */}
              <motion.div className="flex justify-end"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
              >
                <div className="w-full max-w-sm" style={{
                  background: 'rgba(10,10,10,0.80)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(240,240,240,0.08)',
                }}>
                  <div className="px-10 py-12">

                    {/* Mode toggle */}
                    <div className="flex items-center gap-0 mb-10">
                      {(['in', 'up'] as const).map((m, i) => (
                        <React.Fragment key={m}>
                          {i > 0 && (
                            <span className="text-cryo-fg/15 px-3" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px' }}>/</span>
                          )}
                          <button
                            onClick={() => { setMode(m); resetFields(); }}
                            style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', background: 'none', border: 'none', padding: 0 }}
                            className={`pb-1.5 border-b transition-all duration-300 ${mode === m ? 'text-cryo-fg border-cryo-fg/40' : 'text-cryo-fg/25 border-transparent hover:text-cryo-fg/50'}`}
                          >
                            {m === 'in' ? t('auth_signin') : t('auth_signup')}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Heading */}
                    <AnimatePresence mode="wait">
                      <motion.h1 key={mode + '-title'}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                        className="text-cryo-fg mb-10"
                        style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: '0.01em' }}
                      >
                        {mode === 'in' ? t('auth_welcome') : t('auth_create')}
                      </motion.h1>
                    </AnimatePresence>

                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="mb-6 px-4 py-3 border border-red-500/20 bg-red-500/5"
                        >
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(239,68,68,0.7)' }}>
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                      <motion.form key={mode} variants={formSwitch} initial="hidden" animate="visible" exit="exit"
                        onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

                        {/* Display name — sign up only */}
                        {mode === 'up' && (
                          <motion.div custom={0} variants={fieldIn} initial="hidden" animate="visible">
                            <label htmlFor="auth-name" className={labelClass} style={{ fontFamily: 'var(--font-ui)' }}>Name</label>
                            <input id="auth-name" type="text" autoComplete="name" placeholder="Your name"
                              value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} style={{ fontFamily: 'var(--font-ui)' }} />
                          </motion.div>
                        )}

                        {/* Email */}
                        <motion.div custom={mode === 'up' ? 1 : 0} variants={fieldIn} initial="hidden" animate="visible">
                          <label htmlFor="auth-email" className={labelClass} style={{ fontFamily: 'var(--font-ui)' }}>Email</label>
                          <input id="auth-email" type="email" autoComplete="email" placeholder="your@email.com"
                            value={email} onChange={e => setEmail(e.target.value)} className={inputClass} style={{ fontFamily: 'var(--font-ui)' }} />
                        </motion.div>

                        {/* Password */}
                        <motion.div custom={mode === 'up' ? 2 : 1} variants={fieldIn} initial="hidden" animate="visible">
                          <label htmlFor="auth-password" className={labelClass} style={{ fontFamily: 'var(--font-ui)' }}>{t('auth_pass_lbl')}</label>
                          <input id="auth-password" type="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} className={inputClass} style={{ fontFamily: 'var(--font-ui)' }} />
                        </motion.div>

                        {/* Confirm password — sign up only */}
                        {mode === 'up' && (
                          <motion.div custom={3} variants={fieldIn} initial="hidden" animate="visible">
                            <label htmlFor="auth-confirm" className={labelClass} style={{ fontFamily: 'var(--font-ui)' }}>{t('auth_confirm')}</label>
                            <input id="auth-confirm" type="password" autoComplete="new-password" placeholder="••••••••"
                              value={confirm} onChange={e => setConfirm(e.target.value)}
                              className={`${inputClass} ${passwordMismatch ? 'border-red-500/40' : ''}`}
                              style={{ fontFamily: 'var(--font-ui)' }} />
                            {passwordMismatch && (
                              <p className="mt-1.5" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(239,68,68,0.6)' }}>
                                Passwords do not match
                              </p>
                            )}
                          </motion.div>
                        )}

                        <motion.button custom={mode === 'up' ? 4 : 2} variants={fieldIn} initial="hidden" animate="visible"
                          type="submit"
                          disabled={loading || passwordMismatch}
                          className="explore-btn w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ display: 'block', textAlign: 'center' }}>
                          {loading ? '...' : mode === 'in' ? t('auth_signin') : t('auth_signup')}
                        </motion.button>
                      </motion.form>
                    </AnimatePresence>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                      <div className="flex-1 h-px bg-cryo-border" />
                      <span className="text-cryo-fg/20" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{t('auth_or')}</span>
                      <div className="flex-1 h-px bg-cryo-border" />
                    </div>

                    {/* Google */}
                    <button type="button" onClick={handleGoogle} disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-cryo-border hover:border-cryo-fg/25 hover:bg-cryo-fg/[0.04] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.45)', background: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(240,240,240,0.3)"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(240,240,240,0.3)"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="rgba(240,240,240,0.3)"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(240,240,240,0.3)"/>
                      </svg>
                      {t('auth_google')}
                    </button>

                    {/* Switch mode */}
                    <div className="mt-8 pt-7 border-t border-cryo-border flex items-center gap-2.5">
                      <span className="text-cryo-fg/20" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        {mode === 'in' ? t('auth_no_acc') : t('auth_have_acc')}
                      </span>
                      <button onClick={switchMode} className="text-cryo-fg/40 hover:text-cryo-fg transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', padding: 0 }}>
                        {mode === 'in' ? t('auth_signup_arr') : t('auth_signin_arr')}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
