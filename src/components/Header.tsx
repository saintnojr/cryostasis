'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useCart }     from '@/context/CartContext';
import { useHeroExit } from '@/context/HeroExitContext';
import { useLang }     from '@/context/LanguageContext';
import { useAuth }     from '@/context/AuthContext';

export default function Header() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const profileRef                        = useRef<HTMLDivElement>(null);

  const { totalQty }             = useCart();
  const { triggerExit }          = useHeroExit();
  const { lang, setLang, t }     = useLang();
  const { user, logout, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const isHome   = pathname === '/';

  /* ── Scroll listener ──────────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on scroll ─────────────────────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [menuOpen]);

  /* ── Close profile dropdown on outside click ─────────────────────────── */
  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen]);

  /* ── Navigation helper ────────────────────────────────────────────────── */
  const navigate = useCallback(async (href: string) => {
    setMenuOpen(false);
    setProfileOpen(false);
    if (isHome && href === '/product/vinculum') {
      await triggerExit();
    }
    router.push(href);
  }, [isHome, triggerExit, router]);

  /* ── Profile button handler ───────────────────────────────────────────── */
  const handleProfileClick = useCallback(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setProfileOpen(o => !o);
    }
  }, [user, navigate]);

  const handleLogout = useCallback(async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await logout();
    router.push('/');
  }, [logout, router]);

  const toggleLang = () => setLang(lang === 'EN' ? 'RU' : 'EN');

  const NAV = [
    { label: t('nav_home'),    href: '/'                 },
    { label: t('nav_product'), href: '/product/vinculum' },
  ];

  /* ── NavLink component ────────────────────────────────────────────────── */
  function NavLink({ label, href, className = 'nav-link', children }: {
    label: string; href: string; className?: string; children?: React.ReactNode;
  }) {
    const shouldIntercept = isHome && href === '/product/vinculum';
    if (shouldIntercept) {
      return (
        <button onClick={() => navigate(href)} className={className} style={{ background: 'none', border: 'none', padding: 0 }}>
          {children ?? label}
        </button>
      );
    }
    return (
      <a href={href} onClick={e => { e.preventDefault(); navigate(href); }} className={className}>
        {children ?? label}
      </a>
    );
  }

  /* ── User avatar initials ─────────────────────────────────────────────── */
  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '??';

  const userLabel = user?.displayName ?? user?.email ?? '';

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-cryo-border bg-cryo-bg/80 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cryo-fg/30"
            aria-label="CryoStasis — Home">
            <AppLogo src="/assets/images/Logo-1776116399560.png" size={28} className="opacity-90 group-hover:opacity-100 transition-opacity duration-300 logo-white" />
            <span className="text-cryo-fg text-base tracking-tight leading-none" style={{ fontFamily: 'var(--font-logo)', letterSpacing: '-0.01em' }}>CryoStasis©</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV.map(link => (
              <NavLink key={link.href} label={link.label} href={link.href} />
            ))}

            {/* Language toggle */}
            <button onClick={toggleLang} className="nav-link flex items-center gap-0"
              aria-label={`Switch to ${lang === 'EN' ? 'Russian' : 'English'}`}>
              <span className={lang === 'EN' ? 'text-cryo-fg/90' : 'text-cryo-fg/30'}>EN</span>
              <span className="text-cryo-fg/20 mx-1">/</span>
              <span className={lang === 'RU' ? 'text-cryo-fg/90' : 'text-cryo-fg/30'}>RU</span>
            </button>

            {/* Cart */}
            <a href="/cart" onClick={e => { e.preventDefault(); navigate('/cart'); }}
              className="nav-link flex items-center gap-1.5 relative" aria-label={`Cart, ${totalQty} items`}>
              <ShoppingCartIcon className="w-4 h-4 opacity-50" strokeWidth={1.5} />
              <AnimatePresence mode="wait">
                <motion.span key={totalQty} initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }} transition={{ duration: 0.2 }}>
                  ({totalQty})
                </motion.span>
              </AnimatePresence>
            </a>

            {/* Profile button / dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={handleProfileClick}
                disabled={loading}
                className="nav-link flex items-center gap-2"
                aria-label={user ? 'Account menu' : 'Sign in'}
                aria-expanded={profileOpen}
              >
                {user ? (
                  <span
                    className="w-6 h-6 rounded-full border border-cryo-fg/25 flex items-center justify-center text-cryo-fg/70 hover:border-cryo-fg/50 hover:text-cryo-fg transition-all duration-200"
                    style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.05em' }}
                  >
                    {userInitials}
                  </span>
                ) : (
                  <UserIcon className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                )}
              </button>

              {/* Profile dropdown */}
              <AnimatePresence>
                {profileOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute right-0 top-full mt-3 w-56 border border-cryo-border"
                    style={{
                      background: 'rgba(10,10,10,0.95)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-cryo-border">
                      <p className="text-cryo-fg/80 truncate" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.06em' }}>
                        {userLabel}
                      </p>
                      <p className="text-cryo-fg/25 mt-0.5" style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Signed in
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <button
                        onClick={() => navigate('/account')}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-cryo-fg/40 hover:text-cryo-fg/80 hover:bg-cryo-fg/[0.04] transition-all duration-200"
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                      >
                        <UserIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Account
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-cryo-fg/40 hover:text-cryo-fg/80 hover:bg-cryo-fg/[0.04] transition-all duration-200"
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                      >
                        <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile icons */}
          <div className="flex md:hidden items-center gap-4">
            <a href="/cart" onClick={e => { e.preventDefault(); navigate('/cart'); }}
              className="nav-link flex items-center gap-1" aria-label="Cart">
              <ShoppingCartIcon className="w-4 h-4 opacity-50" strokeWidth={1.5} />
              <AnimatePresence mode="wait">
                <motion.span key={totalQty} className="text-[10px]" initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }} transition={{ duration: 0.2 }}>
                  ({totalQty})
                </motion.span>
              </AnimatePresence>
            </a>
            <button onClick={() => setMenuOpen(o => !o)} className="nav-link p-1"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
              {menuOpen
                ? <XMarkIcon className="w-5 h-5 text-cryo-fg/70" strokeWidth={1.5} />
                : <Bars3Icon className="w-5 h-5 text-cryo-fg/50" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div key="mobile-menu" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-cryo-bg/95 backdrop-blur-xl flex flex-col pt-20 px-8 pb-10">
            <nav className="flex flex-col gap-6 mt-8" aria-label="Mobile navigation">
              {NAV.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.07, duration: 0.4, ease: [0.23,1,0.32,1] }}>
                  <button onClick={() => navigate(link.href)}
                    className="text-cryo-fg/60 hover:text-cryo-fg transition-colors"
                    style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.15em', fontSize:'13px', textTransform:'uppercase', background:'none', border:'none', padding:0 }}>
                    {link.label}
                  </button>
                </motion.div>
              ))}

              <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: NAV.length * 0.07, duration:0.4, ease:[0.23,1,0.32,1] }}>
                <button onClick={() => { toggleLang(); setMenuOpen(false); }}
                  className="text-cryo-fg/40"
                  style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.15em', fontSize:'13px', textTransform:'uppercase' }}>
                  <span className={lang === 'EN' ? 'text-cryo-fg/90' : 'text-cryo-fg/30'}>EN</span>
                  <span className="text-cryo-fg/20 mx-1.5">/</span>
                  <span className={lang === 'RU' ? 'text-cryo-fg/90' : 'text-cryo-fg/30'}>RU</span>
                </button>
              </motion.div>

              <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:(NAV.length+1)*0.07, duration:0.4 }}>
                {user ? (
                  <div className="flex flex-col gap-4">
                    <span className="text-cryo-fg/25" style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.12em', fontSize:'10px', textTransform:'uppercase' }}>
                      {userLabel}
                    </span>
                    <button onClick={() => navigate('/account')} className="text-cryo-fg/40 flex items-center gap-2"
                      style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.15em', fontSize:'13px', textTransform:'uppercase', background:'none', border:'none', padding:0 }}>
                      <UserIcon className="w-4 h-4" strokeWidth={1.5} /> Account
                    </button>
                    <button onClick={handleLogout} className="text-cryo-fg/40 flex items-center gap-2"
                      style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.15em', fontSize:'13px', textTransform:'uppercase', background:'none', border:'none', padding:0 }}>
                      <ArrowRightOnRectangleIcon className="w-4 h-4" strokeWidth={1.5} /> Sign out
                    </button>
                  </div>
                ) : (
                  <button onClick={() => navigate('/auth')} className="text-cryo-fg/40 flex items-center gap-2"
                    style={{ fontFamily:'var(--font-ui)', letterSpacing:'0.15em', fontSize:'13px', textTransform:'uppercase', background:'none', border:'none', padding:0 }}>
                    <UserIcon className="w-4 h-4" strokeWidth={1.5} /> {t('footer_auth')}
                  </button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
