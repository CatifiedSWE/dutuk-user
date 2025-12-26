'use client';

import React from 'react';
import { Vendor } from '@/domain/vendor';
import { ProfileHeaderSection } from './sections/ProfileHeaderSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { SocialLinksSection } from './sections/SocialLinksSection';

interface VendorProfileScreenProps {
  vendor: Vendor;
}

export function VendorProfileScreen({ vendor }: VendorProfileScreenProps) {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <ProfileHeaderSection vendor={vendor} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 mt-8">
          {/* Left Column - Portfolio and other content */}
          <div className="lg:col-span-2 space-y-8">
            <PortfolioSection portfolio={vendor.portfolio} />
          </div>

          {/* Right Column - Reviews and Social */}
          <div className="space-y-8">
            <ReviewsSection reviews={vendor.reviews} averageRating={vendor.rating} />
            <SocialLinksSection socialLinks={vendor.socialLinks} />
          </div>
        </div>
      </div>
    </div>
  );
}