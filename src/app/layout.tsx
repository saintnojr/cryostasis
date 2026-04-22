import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { AuthProvider }       from '@/context/AuthContext';
import { CartProvider }       from '@/context/CartContext';
import { HeroExitProvider }   from '@/context/HeroExitContext';
import { LanguageProvider }   from '@/context/LanguageContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4028'),
  title: 'CryoStasis — Vinculum Cryogenic Organ Transport Case',
  description:
    'CryoStasis engineers the Vinculum — a precision cryogenic case for organ transportation. ' +
    'Absolute thermal stability to −196 \u00B0C for the most critical deliveries in medicine.',
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <HeroExitProvider>
                {children}
              </HeroExitProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
