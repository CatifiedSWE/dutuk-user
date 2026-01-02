'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useVendors } from '@/hooks/useVendors';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';

export default function TopRatedNearYouSection() {
    // Fetch top 3 vendors sorted by rating
    const { vendors, loading, error } = useVendors({ limit: 3 });

    // Show loading state
    if (loading) {
        return (
            <section className="w-full flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                        Top Rated <span className="text-[#7C2A2A]">Near You</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                </div>
            </section>
        );
    }

    // Show error state
    if (error) {
        return (
            <section className="w-full flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                        Top Rated <span className="text-[#7C2A2A]">Near You</span>
                    </h2>
                </div>
                <ErrorMessage message="Failed to load top rated vendors." />
            </section>
        );
    }

    // Show empty state
    if (!vendors || vendors.length === 0) {
        return (
            <section className="w-full flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                        Top Rated <span className="text-[#7C2A2A]">Near You</span>
                    </h2>
                </div>
                <EmptyState message="No vendors available at the moment." />
            </section>
        );
    }

    // Sort vendors by rating (highest first) and take top 3
    const topVendors = [...vendors]
        .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
        .slice(0, 3);

    return (
        <section className="w-full flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                    Top Rated <span className="text-[#7C2A2A]">Near You</span>
                </h2>
                <Link 
                    href="/explore"
                    className="flex items-center gap-2 font-urbanist font-semibold text-sm text-[#7C2A2A] hover:text-[#4F0000] transition-colors group"
                >
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topVendors.map((vendor, index) => {
                    const priceRange = getPriceRange(vendor.avg_rating);
                    return (
                        <Link
                            key={vendor.id}
                            href={`/vendors/profile/${vendor.id}`}
                            className="group flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Vendor Image */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <Image
                                    src={vendor.logo_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop&q=75'}
                                    alt={vendor.company}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                
                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                    <Star className="w-4 h-4 fill-[#FFC13C] text-[#FFC13C]" />
                                    <span className="font-urbanist font-bold text-sm text-[#4F0000]">
                                        {vendor.avg_rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col gap-3">
                                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#4F0000] line-clamp-1">
                                    {vendor.company}
                                </h3>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-[#4F0000]/60">
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-urbanist font-medium line-clamp-1">
                                            {vendor.service_area || 'Chennai'}
                                        </span>
                                    </div>
                                    <span className="font-urbanist font-bold text-[#7C2A2A]">
                                        {priceRange}
                                    </span>
                                </div>

                                {/* View Details Button */}
                                <button className="mt-2 w-full bg-[#FDF5E6] text-[#7C2A2A] py-3 rounded-xl font-urbanist font-semibold text-sm hover:bg-[#7C2A2A] hover:text-white transition-all duration-300 shadow-sm">
                                    View Details
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

// Helper function to generate price range based on rating
function getPriceRange(rating: number): string {
    if (rating >= 4.8) return '$2k - $5k';
    if (rating >= 4.5) return '$$$';
    return '$$';
}
