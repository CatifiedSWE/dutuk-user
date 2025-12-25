'use client';

import { ChevronDown } from 'lucide-react';

interface EventsCategoriesSectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const categories = [
  { id: 'dj', name: 'DJ', icon: '🎵' },
  { id: 'photography', name: 'Photography', icon: '📸' },
  { id: 'videography', name: 'Videography', icon: '🎥' },
  { id: 'decoration', name: 'Decoration', icon: '🎨' },
  { id: 'catering', name: 'Catering', icon: '🍽️' },
  { id: 'music', name: 'Music / Entertainment', icon: '🎤' },
];

export default function EventsCategoriesSection({ selectedCategory, setSelectedCategory }: EventsCategoriesSectionProps) {
  return (
    <div className="w-full bg-[#FDF5E6] py-6 border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap font-poppins text-sm px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'text-[#7C2A2A] border-b-2 border-[#7C2A2A] font-semibold'
                  : 'text-gray-600 hover:text-[#7C2A2A]'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
          
          {/* More Button */}
          <button className="flex items-center gap-1 whitespace-nowrap font-poppins text-sm text-gray-600 hover:text-[#7C2A2A] px-4 py-2 rounded-lg transition-colors">
            <span>more</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
