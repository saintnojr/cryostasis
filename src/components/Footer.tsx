import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { FOOTER_SOCIALS, FOOTER_EMAIL } from '@/constants/navigation';
import FooterClient from '@/components/FooterClient';

export default function Footer() {
  return (
    <footer
      className="relative z-10 border-t border-cryo-border bg-cryo-bg"
      style={{ fontFamily: 'var(--font-ui)' }}
      aria-label="Site footer"
    >
      <FooterClient
        socials={[...FOOTER_SOCIALS]}
        email={[...FOOTER_EMAIL]}
      />
    </footer>
  );
}
