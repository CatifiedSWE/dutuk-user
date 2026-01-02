'use client';

import { useAuth } from '@/hooks/useAuth';
import HomePageScreen from '@/modules/homepage';
import MainLayout from '@/components/layouts/MainLayout';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout variant={isAuthenticated ? 'solid' : 'glassmorphic'}>
      <HomePageScreen />
    </MainLayout>
  );
}
