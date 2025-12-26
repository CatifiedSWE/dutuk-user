'use client';

import HomePageScreen from '@/modules/homepage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';

export default function HomePage() {
  return (
    <GradientBackground>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="glassmorphic" />
      </div>
      <HomePageScreen />
      <Footer />
    </GradientBackground>
  );
}
