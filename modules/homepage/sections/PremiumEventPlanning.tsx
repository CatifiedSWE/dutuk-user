'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useVendors } from '@/hooks/useVendors';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';

export default function PremiumEventPlanning() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // Fetch premium vendors (those with high ratings)
    const { vendors, loading, error } = useVendors({ limit: 6 });
    
    // Filter for premium vendors (rating >= 4.7 or verified)
    const premiumVendors = vendors.filter(v => v.avg_rating >= 4.7 || v.verified_at);

    const scrollMap = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };
    
    // Show loading state
    if (loading) {
        return (
            <section className="w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <SectionHeader
                        label="PREMIUM EXPERIENCES"
                        titleMain="Premium"
                        titleAccent="Event Planning"
                    />
                </div>
                <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[300px] md:w-[340px]">
                            <LoadingCard />
                        </div>
                    ))}
                </div>
            </section>
        );
    }
    
    // Show error state
    if (error) {
        return (
            <section className="w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <SectionHeader
                        label="PREMIUM EXPERIENCES"
                        titleMain="Premium"
                        titleAccent="Event Planning"
                    />
                </div>
                <ErrorMessage message="Failed to load premium vendors." />
            </section>
        );
    }
    
    // Show empty state
    if (premiumVendors.length === 0) {
        return (
            <section className="w-full flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <SectionHeader
                        label="PREMIUM EXPERIENCES"
                        titleMain="Premium"
                        titleAccent="Event Planning"
                    />
                </div>
                <EmptyState message="No premium vendors available at the moment." />
            </section>
        );
    }

    return (
        <section className="w-full flex flex-col gap-6">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <SectionHeader
                    label="PREMIUM EXPERIENCES"
                    titleMain="Premium"
                    titleAccent="Event Planning"
                />

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollMap('left')}
                        className="p-3 rounded-full bg-[#FFC13C]/80 hover:bg-[#FFC13C] text-[#4F0000] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scrollMap('right')}
                        className="p-3 rounded-full bg-[#FFC13C] text-[#4F0000] hover:bg-[#e6ac34] transition-all shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Events Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory"
            >
                {premiumVendors.map((vendor, index) => {
                    return (
                        <Link
                            key={vendor.id}
                            href={`/vendors/profile/${vendor.id}`}
                            className="flex-shrink-0 w-[300px] md:w-[340px] bg-white p-3 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 snap-start group"
                        >
                            {/* Vendor Image */}
                            <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                                <Image
                                    src={vendor.logo_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop&q=75'}
                                    alt={vendor.company}
                                    fill
                                    sizes="340px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Premium Badge */}
                                <div className="absolute left-3 bottom-3 bg-[#FFC13C] px-4 py-1.5 rounded-full shadow-lg">
                                    <span className="font-poppins text-sm text-[#4F0000] font-medium">
                                        Premium
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-2 flex flex-col gap-3">
                                <span className="font-inter font-light text-sm md:text-base text-[#535353]">
                                    {vendor.service_area || 'Chennai'}
                                </span>

                                <div className="flex flex-col gap-1">
                                    <h3 className="font-poppins font-normal text-lg md:text-xl text-[#333333] line-clamp-2">
                                        {vendor.company}
                                    </h3>
                                    <span className="font-inter font-semibold text-xl text-[#4F0000]">
                                        ⭐ {vendor.avg_rating.toFixed(1)} ({vendor.total_reviews} reviews)
                                    </span>
                                </div>

                                <button className="w-full btn-gradient text-white py-3 rounded-xl font-urbanist font-bold text-sm transition-colors">
                                    Check Availability
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
