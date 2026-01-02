import { Suspense } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { ExploreScreen } from '@/modules/explore/user';

export default function ExplorePage() {
  return (
    <MainLayout variant="solid">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ExploreScreen />
      </Suspense>
    </MainLayout>
  );
}
