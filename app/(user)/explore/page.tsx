import { Suspense } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { ExploreScreen } from '@/modules/explore/user';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function ExplorePageContent() {
  return (
    <MainLayout variant="solid">
      <ExploreScreen />
    </MainLayout>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
          <p className="text-sm text-[#4F0000]/60">Loading explore...</p>
        </div>
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
}
