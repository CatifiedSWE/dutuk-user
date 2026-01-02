'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';
import { VendorProfileScreen } from '@/modules/vendors/user';
import { useVendor } from '@/hooks/useVendors';
import { ErrorMessage } from '@/components/ErrorMessage';

interface VendorProfilePageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default function VendorProfilePage({ params }: VendorProfilePageProps) {
  // Unwrap the params promise
  const { vendorId } = use(params);
  
  // Fetch vendor from Supabase
  const { vendor, loading, error } = useVendor(vendorId);

  // Show loading state
  if (loading) {
    return (
      <GradientBackground>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header variant="solid" />
        </div>
        <div className="min-h-screen bg-background-light pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="h-64 bg-gray-200 rounded-3xl" />
                  <div className="h-64 bg-gray-200 rounded-3xl" />
                </div>
                <div className="space-y-8">
                  <div className="h-48 bg-gray-200 rounded-3xl" />
                  <div className="h-48 bg-gray-200 rounded-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </GradientBackground>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <GradientBackground>
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header variant="solid" />
        </div>
        <div className="min-h-screen bg-background-light pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ErrorMessage message="Failed to load vendor profile. Please try again later." />
          </div>
        </div>
        <Footer />
      </GradientBackground>
    );
  }

  // If vendor not found, show 404
  if (!vendor) {
    notFound();
  }

  // Transform Supabase vendor data to match Vendor interface expected by VendorProfileScreen
  const vendorData = {
    id: vendor.id,
    name: vendor.company,
    username: `@${vendor.company.toLowerCase().replace(/\s+/g, '')}`,
    email: 'contact@vendor.com', // Not in database - placeholder
    phone: '+91-0000000000', // Not in database - placeholder
    description: vendor.description || 'Professional event services provider',
    logo: vendor.logo_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=300&fit=crop&q=75',
    coverImage: vendor.logo_url || 'https://images.unsplash.com/photo-1519167758481-83f29da8ae8d?w=1200&h=400&fit=crop&q=75',
    profileImage: vendor.logo_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=300&fit=crop&q=75',
    rating: vendor.avg_rating || 4.5,
    totalEvents: vendor.years_in_business ? vendor.years_in_business * 10 : 0, // Estimate based on years in business
    reviewCount: vendor.total_reviews || 0,
    verified: !!vendor.verified_at, // Convert verified_at to boolean
    specialties: vendor.subcategories || [vendor.category || 'Event Services'],
    musicGenres: vendor.subcategories || [],
    location: vendor.service_area || 'Chennai',
    joinedDate: vendor.created_at || new Date().toISOString(),
    joinedYear: new Date(vendor.created_at).getFullYear().toString(),
    portfolio: {
      photos: [],
      videos: [],
      events: []
    },
    reviews: [],
    socialLinks: {
      facebook: '',
      instagram: ''
    },
    isOnline: vendor.is_active || false
  };

  return (
    <GradientBackground>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="solid" />
      </div>
      <VendorProfileScreen vendor={vendorData} />
      <Footer />
    </GradientBackground>
  );
}
