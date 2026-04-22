import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import ProductHero from './components/ProductHero';
import ProductGallery from './components/ProductGallery';
import SpecsTable from './components/SpecsTable';
import TeardownSection from './components/TeardownSection';
import PurchasePanel from './components/PurchasePanel';

// Product data is fetched client-side via useProduct hook inside PurchasePanel.
// No server-side Supabase/Firebase admin calls needed — Firebase client SDK handles it.
export default function ProductPage() {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main>
        <ProductHero />
        <ProductGallery />
        <SpecsTable />
        <TeardownSection />
        <PurchasePanel />
      </main>
      <Footer />
    </>
  );
}
