'use client';

import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface EventsSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function EventsSearchSection({ searchQuery, setSearchQuery }: EventsSearchSectionProps) {
  return (
    <div className="w-full bg-[#FDF5E6] pt-8 pb-6">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          {/* Vendors Dropdown */}
          <button className="flex items-center gap-2 bg-white rounded-full px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors">
            <span className="font-poppins text-sm text-gray-700">Vendors</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* Search Input Container */}
          <div className="flex-1 relative flex items-center bg-white rounded-full px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 font-poppins"
            />
            
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {/* Search Button */}
            <button className="bg-[#270100] p-2 rounded-full hover:bg-[#4F0000] transition-colors">
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 bg-white rounded-full px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <span className="font-poppins text-sm text-gray-700">Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
