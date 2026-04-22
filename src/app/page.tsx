'use client';

import React from 'react'; // Убрали useEffect и useRef
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/home/components/HeroSection';
import GrainOverlay from '@/components/GrainOverlay';

export default function HomePage() {
  return (
    <>
      {/* Здесь больше нет div с курсором */}
      <GrainOverlay />
      <Header />
      <main className="relative min-h-screen animated-gradient-bg">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}