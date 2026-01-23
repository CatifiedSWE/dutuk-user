'use client';

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import HomePageScreen from '@/modules/homepage';
import MainLayout from '@/components/layouts/MainLayout';

// Force dynamic rendering to prevent prerendering errors with auth
export const dynamic = 'force-dynamic';

function HomePageContent() {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout variant={isAuthenticated ? 'solid' : 'glassmorphic'}>
      <HomePageScreen />
    </MainLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
            <p className="font-urbanist text-sm text-[#4F0000]/60">Loading...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
