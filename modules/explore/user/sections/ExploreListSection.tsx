import React, { useMemo } from 'react';
import Image from 'next/image';
import { Filter, Grid, List as ListIcon, MapPin, Star, Heart, Calendar } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { exploreData } from '@/demo/exploreData';

interface ExploreListSectionProps {
    selectedFilter: 'Vendors' | 'Events' | 'Packages';
}

export default function ExploreListSection({ selectedFilter }: ExploreListSectionProps) {
    // Filter data based on selected filter
    const filteredData = useMemo(() => {
        const filterMap: Record<string, 'vendor' | 'event' | 'package'> = {
            'Vendors': 'vendor',
            'Events': 'event',
            'Packages': 'package'
        };

        const typeToFilter = filterMap[selectedFilter];
        return exploreData.filter(item => item.type === typeToFilter);
    }, [selectedFilter]);

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <SectionHeader
                label="CURATED SELECTION"
                titleMain="Discover"
                titleAccent={selectedFilter}
                subtitle={`Browse through our curated selection of ${selectedFilter.toLowerCase()}`}
            />

            {/* Items Grid */}
            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredData.map((item, index) => (
                        item.type === 'event' ? (
                            // Event Card Design
                            <div
                                key={item.id}
                                className="flex flex-col bg-white rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Event Image with Date Badge */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                    {/* Date Badge */}
                                    {item.dateRange && (
                                        <div className="absolute top-4 left-4">
                                            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-lg">
                                                <Calendar className="w-4 h-4 text-[#4F0000]" />
                                                <span className="font-urbanist font-medium text-sm text-[#4F0000]">
                                                    {item.dateRange}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Heart Icon */}
                                    <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <Heart className="w-5 h-5 text-[#7C2A2A]" />
                                    </button>
                                </div>

                                {/* Event Details */}
                                <div className="p-5 flex flex-col gap-4">
                                    {/* Vendor Info */}
                                    {item.vendorAvatar && item.vendorName && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                    <Image
                                                        src={item.vendorAvatar}
                                                        alt={item.vendorName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="font-urbanist font-semibold text-[#4F0000]">
                                                    {item.vendorName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 fill-[#7C2A2A] text-[#7C2A2A]" />
                                                <span className="font-urbanist font-bold text-[#4F0000]">{item.rating}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Event Name */}
                                    <h3 className="font-poppins font-bold text-xl text-[#4F0000]">
                                        {item.name}
                                    </h3>

                                    {/* Location and View Map */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[#4F0000]/70">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-urbanist text-sm">{item.location}</span>
                                        </div>
                                        <button className="font-urbanist font-medium text-sm text-[#7C2A2A] hover:underline">
                                            View in map
                                        </button>
                                    </div>

                                    {/* Price Per Person */}
                                    {item.pricePerPerson && (
                                        <div className="flex items-center gap-2 bg-[#FFC13C] px-4 py-2 rounded-full w-fit">
                                            <span className="text-2xl">₹</span>
                                            <span className="font-poppins font-bold text-lg text-[#4F0000]">
                                                {item.pricePerPerson}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Vendor/Package Card Design
                            <div
                                key={item.id}
                                className="flex flex-col bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 cursor-pointer animate-fadeInUp overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Vendor Image with Avatar Overlay */}
                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute inset-0 m-4">
                                        <div className="relative w-full h-full rounded-[28px] overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                    {/* Heart Icon */}
                                    <button className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
                                        <Heart className="w-5 h-5 text-[#7C2A2A] fill-[#7C2A2A]" />
                                    </button>
                                    {/* Vendor Avatar Overlay (only for vendors) */}
                                    {item.type === 'vendor' && item.vendorAvatar && (
                                        <div className="absolute bottom-2 left-6 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white z-10">
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
                                <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
                                    {/* Vendor Name and Rating */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-poppins font-bold text-2xl text-[#4F0000] leading-tight">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <Star className="w-6 h-6 fill-[#FFC13C] text-[#FFC13C]" />
                                            <span className="font-urbanist font-bold text-xl text-[#4F0000]">{item.rating}</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-[#4F0000]/60 mt-1">
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-urbanist text-base">{item.location}</span>
                                    </div>

                                    {/* Price Range */}
                                    <div className="font-poppins font-bold text-2xl text-[#4F0000] mt-3">
                                        {item.price}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="font-urbanist text-[#4F0000]/60 text-lg">
                        No {selectedFilter.toLowerCase()} found. Try a different filter.
                    </p>
                </div>
            )}
        </section>
    );
}
