'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useLang } from '@/context/LanguageContext';

type Social = { label: string; href: string };
type Email  = { label: string; href: string; display: string };

export default function FooterClient({ socials, email }: { socials: Social[]; email: Email[] }) {
  const { t } = useLang();

  const FOOTER_NAV = [
    { label: t('footer_home'),    href: '/'                 },
    { label: t('footer_product'), href: '/product/vinculum' },
    { label: t('footer_cart'),    href: '/cart'             },
    { label: t('footer_auth'),    href: '/auth'             },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-10">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-cryo-border">

        {/* Left: Logo + tagline */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-cryo-border py-10 md:py-14 pr-0 md:pr-12 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <AppLogo src="/assets/images/Logo-1776116399560.png" size={36} className="opacity-80 logo-footer" />
            <span className="text-cryo-fg/90 text-3xl md:text-4xl leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-logo)', letterSpacing: '-0.02em' }}>
              CryoStasis©
            </span>
          </div>
          <p className="mt-8 md:mt-0 text-cryo-fg/20 leading-relaxed max-w-xs"
            style={{ fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', fontSize: '10px', whiteSpace: 'pre-line' }}>
            {t('footer_tagline')}
          </p>
        </div>

        {/* Right: Three columns */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-0">

          {/* Navigation */}
          <div className="border-b sm:border-b-0 sm:border-r border-cryo-border py-10 md:py-14 px-0 sm:px-8 md:px-10">
            <p className="footer-label mb-5">{t('footer_nav')}</p>
            <ul className="space-y-0.5">
              {FOOTER_NAV.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="border-b sm:border-b-0 sm:border-r border-cryo-border py-10 md:py-14 px-0 sm:px-8 md:px-10">
            <p className="footer-label mb-5">{t('footer_socials')}</p>
            <ul className="space-y-0.5">
              {socials.map(item => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="footer-link">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Email */}
          <div className="py-10 md:py-14 px-0 sm:px-8 md:px-10">
            <p className="footer-label mb-5">{t('footer_email')}</p>
            <ul className="space-y-0.5">
              {email.map(item => (
                <li key={item.label}>
                  <a href={item.href} className="footer-link" style={{ fontSize: '11px' }}>{item.display}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="text-cryo-fg/20"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {t('footer_rights')}
        </span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="footer-link"
            style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', minHeight: 'auto', padding: '0' }}>
            {t('footer_privacy')}
          </Link>
          <Link href="/terms" className="footer-link"
            style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', minHeight: 'auto', padding: '0' }}>
            {t('footer_terms')}
          </Link>
        </div>
      </div>
    </div>
  );
}
