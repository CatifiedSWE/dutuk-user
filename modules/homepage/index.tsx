'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Guest sections
import HeroSection from './sections/HeroSection';
import EventCategories from './sections/EventCategories';
import VendorCategories from './sections/VendorCategories';
import BundleServices from './sections/BundleServices';
import PremiumEventPlanning from './sections/PremiumEventPlanning';
import PremiumPackagesBanner from './sections/PremiumPackagesBanner';

// Authenticated sections
import AuthenticatedHeroSection from './sections/AuthenticatedHeroSection';
import BrowseCategoriesSection from './sections/BrowseCategoriesSection';
import FeaturedCollectionsSection from './sections/FeaturedCollectionsSection';
import TopRatedNearYouSection from './sections/TopRatedNearYouSection';

export default function HomePageScreen() {
  const { isAuthenticated, loading } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Handle transition animation
  useEffect(() => {
    if (!loading) {
      // Small delay to show transition
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading state with fade-in
  if (loading || isTransitioning) {
    return (
      <div className="font-poppins selection:bg-primary selection:text-white">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
            <p className="font-urbanist text-sm text-[#4F0000]/60">Loading your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render authenticated user layout
  if (isAuthenticated) {
    return (
      <div className="font-poppins selection:bg-primary selection:text-white animate-fadeIn">
        <main className="relative z-10 flex flex-col gap-12 sm:gap-16 lg:gap-20 pb-20">
          {/* Authenticated Hero Section */}
          <AuthenticatedHeroSection />

          {/* Content Wrapper */}
          <div className="relative w-full max-w-[1440px] mx-auto">
            <div className="flex flex-col gap-16 lg:gap-20 w-full px-4 md:px-8 lg:px-12">
              
              {/* Browse Categories Section */}
              <BrowseCategoriesSection />

              {/* Featured Collections Section */}
              <FeaturedCollectionsSection />

              {/* Top Rated Near You Section */}
              <TopRatedNearYouSection />

            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render guest user layout (original)
  return (
    <div className="font-poppins selection:bg-primary selection:text-white animate-fadeIn">
      <main className="relative z-10 flex flex-col gap-12 sm:gap-16 lg:gap-24 pb-20">
        {/* Hero Section - Priority loading */}
        <HeroSection />

        {/* Decorative Background Elements - Wrapper for relative positioning */}
        <div className="relative w-full max-w-[1440px] mx-auto">

          <div className="flex flex-col gap-16 lg:gap-32 w-full px-4 md:px-8 lg:px-12">
            {/* Event Categories Section */}
            <EventCategories />

            {/* Vendor Categories Section */}
            <VendorCategories />

            {/* Bundle Services Section */}
            <BundleServices />

            {/* Premium Packages Banner */}
            <PremiumPackagesBanner />

            {/* Premium Event Planning Section */}
            <PremiumEventPlanning />
          </div>
        </div>
      </main>
    </div>
  );
}
