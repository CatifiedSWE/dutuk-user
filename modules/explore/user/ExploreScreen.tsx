'use client';

import { useState } from 'react';
import ExploreSearchSection from './sections/ExploreSearchSection';
import ExploreListSection from './sections/ExploreListSection';
import PremiumExploreSection from './sections/PremiumExploreSection';

export default function ExploreScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'Vendors' | 'Events' | 'Packages'>('Vendors');

  return (
    <div className="font-poppins selection:bg-primary selection:text-white">
      <main className="flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-20 pt-24">
        {/* Content wrapper */}
        <div className="relative w-full max-w-[1440px] mx-auto">

          <div className="flex flex-col gap-16 lg:gap-32 w-full px-4 md:px-8 lg:px-12 pt-8">
            {/* Search Section */}
            <ExploreSearchSection
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />

            {/* Regular Items List */}
            <ExploreListSection selectedFilter={selectedFilter} />

            {/* Premium Items Section */}
            <PremiumExploreSection selectedFilter={selectedFilter} />
          </div>
        </div>
      </main>
    </div>
  );
}
