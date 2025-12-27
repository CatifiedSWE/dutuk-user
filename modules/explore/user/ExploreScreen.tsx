'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ExploreSearchSection from './sections/ExploreSearchSection';
import ExploreListSection from './sections/ExploreListSection';
import PremiumExploreSection from './sections/PremiumExploreSection';

export default function ExploreScreen() {
  const searchParams = useSearchParams();
  
  // Get initial values from URL params
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') as 'All' | 'Vendors' | 'Events' | 'Packages' | null;
  
  // If there's a search query but no filter, default to 'All' to show all matching results
  const defaultFilter = initialSearch && !initialFilter ? 'All' : (initialFilter || 'Vendors');
  
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Vendors' | 'Events' | 'Packages'>(defaultFilter);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Update state when URL params change
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') as 'All' | 'Vendors' | 'Events' | 'Packages' | null;
    
    setSearchQuery(search);
    
    // If there's a search but no filter, show all results
    if (search && !filter) {
      setSelectedFilter('All');
    } else if (filter && ['All', 'Vendors', 'Events', 'Packages'].includes(filter)) {
      setSelectedFilter(filter);
    }
  }, [searchParams]);

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
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Regular Items List */}
            <ExploreListSection 
              selectedFilter={selectedFilter} 
              searchQuery={searchQuery}
            />

            {/* Premium Items Section */}
            <PremiumExploreSection 
              selectedFilter={selectedFilter}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
