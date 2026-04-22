'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';

// Загружаем HeroSection динамически без SSR
const HeroSection = dynamic(() => import('@/app/home/components/HeroSection'), { 
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" /> // Заглушка, пока грузится
});

export default function HomePage() {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main className="relative min-h-screen animated-gradient-bg">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}