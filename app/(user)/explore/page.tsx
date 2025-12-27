import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';
import { ExploreScreen } from '@/modules/explore/user';

export default function ExplorePage() {
  return (
    <GradientBackground>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="solid" />
      </div>
      <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center">Loading...</div>}>
        <ExploreScreen />
      </Suspense>
      <Footer />
    </GradientBackground>
  );
}
