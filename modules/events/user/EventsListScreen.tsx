'use client';

import { useState } from 'react';
import EventsSearchSection from './sections/EventsSearchSection';
import EventsCategoriesSection from './sections/EventsCategoriesSection';
import EventsListSection from './sections/EventsListSection';
import PremiumEventsSection from './sections/PremiumEventsSection';

export default function EventsListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('dj');

  return (
    <div className="min-h-screen bg-[#FDF5E6] font-poppins selection:bg-[#7C2A2A] selection:text-white">
      {/* Search Section */}
      <EventsSearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Categories Section */}
      <EventsCategoriesSection 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Events List Section */}
      <EventsListSection />

      {/* Premium Events Section */}
      <PremiumEventsSection />
    </div>
  );
}
