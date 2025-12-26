import ExploreSearchSection from './sections/ExploreSearchSection';
import ExploreListSection from './sections/ExploreListSection';
import PremiumExploreSection from './sections/PremiumExploreSection';

export default function ExploreScreen() {
  return (
    <div className="min-h-screen bg-[#FDF5E6] font-poppins selection:bg-[#7C2A2A] selection:text-white">
      <main className="flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-20">
        {/* Decorative Background Elements - Wrapper for relative positioning */}
        <div className="relative w-full max-w-[1440px] mx-auto">
          {/* Decorative Circles */}
          <div className="absolute -left-20 top-0 w-40 h-40 bg-[#4F0000] rounded-full blur-md opacity-15 pointer-events-none will-change-auto" />
          <div className="absolute right-0 top-[400px] w-40 h-40 bg-[#4F0000] rounded-full blur-md opacity-15 pointer-events-none will-change-auto" />

          <div className="flex flex-col gap-16 lg:gap-32 w-full px-4 md:px-8 lg:px-12 pt-8">
            {/* Search Section */}
            <ExploreSearchSection />

            {/* Regular Items List */}
            <ExploreListSection />

            {/* Premium Items Section */}
            <PremiumExploreSection />
          </div>
        </div>
      </main>
    </div>
  );
}
