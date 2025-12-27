'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import { MapPin, Star, Crown, Heart, Calendar } from 'lucide-react';
import { premiumExploreData } from '@/demo/exploreData';

interface PremiumExploreSectionProps {
    selectedFilter: 'All' | 'Vendors' | 'Events' | 'Packages';
    searchQuery: string;
}

// Smart filtering function - searches across multiple fields
function smartFilter(item: typeof premiumExploreData[0], searchQuery: string): boolean {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/); // Split into individual words
    
    // Fields to search in
    const searchableFields = [
        item.name,
        item.location,
        item.type,
        item.vendorName || '',
        item.price
    ].map(field => field.toLowerCase());
    
    // Match if ANY search term matches ANY field (inclusive search)
    return searchTerms.some(term => 
        searchableFields.some(field => field.includes(term))
    );
}

export default function PremiumExploreSection({ selectedFilter, searchQuery }: PremiumExploreSectionProps) {
    // Filter data based on selected filter AND search query
    const filteredData = useMemo(() => {
        return premiumExploreData.filter(item => {
            // Type filter - if "All" is selected, show all types
            const typeMatch = selectedFilter === 'All' || (() => {
                const filterMap: Record<string, 'vendor' | 'event' | 'package'> = {
                    'Vendors': 'vendor',
                    'Events': 'event',
                    'Packages': 'package'
                };
                return item.type === filterMap[selectedFilter];
            })();
            
            // Then apply smart search filter
            const searchMatch = smartFilter(item, searchQuery);
            
            return typeMatch && searchMatch;
        });
    }, [selectedFilter, searchQuery]);
    
    // Get display text for filter
    const filterDisplayText = selectedFilter === 'All' ? 'Results' : selectedFilter;

    // Don't render the section if there are no items
    if (filteredData.length === 0) {
        return null;
    }

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header with Crown Icon */}
            <div className="flex flex-col gap-3">
                <SectionHeader
                    label="EXCLUSIVE COLLECTION"
                    titleMain="Premium"
                    titleAccent={filterDisplayText}
                    subtitle={`Exclusive premium ${filterDisplayText.toLowerCase()} for extraordinary events`}
                />
            </div>

            {/* Premium Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredData.map((item, index) => (
                    item.type === 'event' ? (
                        // Premium Event Card Design
                        <Link
                            href={`/events/details/${item.id}`}
                            key={item.id}
                            className="flex flex-col bg-white rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden border-2 border-[#FFC13C]"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Event Image with Date Badge */}
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover"
                                    loading="lazy"
                                />
                                {/* Date Badge */}
                                {item.dateRange && (
                                    <div className="absolute top-3 left-3">
                                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-lg">
                                            <Calendar className="w-3.5 h-3.5 text-[#4F0000]" />
                                            <span className="font-urbanist font-medium text-xs text-[#4F0000]">
                                                {item.dateRange}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {/* Premium Badge */}
                                <div className="absolute top-3 right-3">
                                    <div className="flex items-center gap-1 bg-[#FFC13C] px-2.5 py-1 rounded-full shadow-lg">
                                        <Crown className="w-3 h-3 fill-[#4F0000] text-[#4F0000]" />
                                        <span className="text-xs font-urbanist font-bold uppercase tracking-wide text-[#4F0000]">Premium</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-4 flex flex-col gap-3">
                                {/* Vendor Info */}
                                {item.vendorAvatar && item.vendorName && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={item.vendorAvatar}
                                                    alt={item.vendorName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-urbanist font-semibold text-sm text-[#4F0000]">
                                                {item.vendorName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-[#7C2A2A] text-[#7C2A2A]" />
                                            <span className="font-urbanist font-bold text-sm text-[#4F0000]">{item.rating}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Event Name */}
                                <h3 className="font-poppins font-bold text-lg text-[#4F0000] line-clamp-2">
                                    {item.name}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-[#4F0000]/70">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-urbanist text-xs">{item.location}</span>
                                </div>

                                {/* Price Per Person */}
                                {item.pricePerPerson && (
                                    <div className="flex items-center gap-2 bg-[#FFC13C] px-3 py-1.5 rounded-full w-fit">
                                        <span className="text-xl">₹</span>
                                        <span className="font-poppins font-bold text-sm text-[#4F0000]">
                                            {item.pricePerPerson}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ) : (
                        // Premium Vendor/Package Card Design
                        <div
                            key={item.id}
                            className="flex flex-col bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden border-2 border-[#FFC13C]"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Vendor Image with Avatar Overlay */}
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 m-3">
                                    <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                {/* Premium Badge */}
                                <div className="absolute top-5 right-5 z-10">
                                    <div className="flex items-center gap-1 bg-[#FFC13C] px-2.5 py-1 rounded-full shadow-lg">
                                        <Crown className="w-3 h-3 fill-[#4F0000] text-[#4F0000]" />
                                        <span className="text-xs font-urbanist font-bold uppercase tracking-wide text-[#4F0000]">Premium</span>
                                    </div>
                                </div>
                                {/* Heart Icon */}
                                <button className="absolute top-5 left-5 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
                                    <Heart className="w-4 h-4 text-[#7C2A2A] fill-[#7C2A2A]" />
                                </button>
                                {/* Vendor Avatar Overlay (only for vendors) */}
                                {item.type === 'vendor' && item.vendorAvatar && (
                                    <div className="absolute bottom-1 left-5 w-24 h-24 rounded-full overflow-hidden border-[6px] border-white z-10">
                                        <Image
                                            src={item.vendorAvatar}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Vendor Details */}
                            <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
                                {/* Vendor Name and Rating */}
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-poppins font-bold text-lg text-[#4F0000] leading-tight">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Star className="w-5 h-5 fill-[#FFC13C] text-[#FFC13C]" />
                                        <span className="font-urbanist font-bold text-base text-[#4F0000]">{item.rating}</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-[#4F0000]/60 mt-1">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-urbanist text-sm">{item.location}</span>
                                </div>

                                {/* Price Range */}
                                <div className="font-poppins font-bold text-lg text-[#4F0000] mt-2">
                                    {item.price}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </section>
    );
}
