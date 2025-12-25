'use client';

import HomePageScreen from '@/modules/homepage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDF5E6]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="glassmorphic" />
      </div>
      <HomePageScreen />
      <Footer />
    </div>
  );
}
