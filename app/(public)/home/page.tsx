'use client';

import HomePageScreen from '@/modules/homepage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDF5E6]">
      <Header />
      <HomePageScreen />
      <Footer />
    </div>
  );
}
