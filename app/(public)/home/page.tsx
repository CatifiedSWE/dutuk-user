'use client';

import HomePageScreen from '@/modules/homepage';
import MainLayout from '@/components/layouts/MainLayout';

export default function HomePage() {
  return (
    <MainLayout variant="glassmorphic">
      <HomePageScreen />
    </MainLayout>
  );
}
