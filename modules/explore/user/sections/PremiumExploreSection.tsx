'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Star, Crown } from 'lucide-react';
import { premiumExploreData } from '@/demo/exploreData';

export default function PremiumExploreSection() {
    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header with Crown Icon */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Crown className="w-8 h-8 text-[#FFC13C] fill-[#FFC13C]" />
                    <h2 className="font-poppins font-semibold text-3xl md:text-4xl text-[#4F0000]">
                        Premium Selection
                    </h2>
                </div>
                <p className="font-urbanist text-[#4F0000]/70 text-lg">
                    Exclusive premium vendors, packages, and venues for extraordinary events
                </p>
            </div>

            {/* Premium Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {premiumExploreData.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-col gap-5 bg-white p-4 rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 group cursor-pointer animate-fadeInUp border border-[#FFC13C]/20"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Item Image Card */}
                        <div className="relative h-60 rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                            {/* Premium Badge */}
                            <div className="absolute top-4 right-4">
                                <div className="flex items-center gap-1.5 bg-[#FFC13C] text-[#4F0000] px-3 py-1.5 rounded-full shadow-lg">
                                    <Crown className="w-3.5 h-3.5 fill-[#4F0000]" />
                                    <span className="text-xs font-urbanist font-bold uppercase tracking-wide">Premium</span>
                                </div>
                            </div>

                            {/* Type Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-block bg-white/90 backdrop-blur-sm text-[#4F0000] px-3 py-1 rounded-full text-xs font-urbanist font-semibold uppercase tracking-wide">
                                    {item.type}
                                </span>
                            </div>

                            {/* Centered Item Name */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-poppins font-semibold text-xl text-white drop-shadow-md text-center px-4">
                                    {item.name}
                                </span>
                            </div>

                            {/* Check Now Button Overlay (Visible on Hover) */}
                            <div className="absolute inset-x-0 bottom-0 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300">
                                <div className="p-5">
                                    <button className="w-full bg-[#FFC13C] text-[#4F0000] py-3 rounded-xl font-urbanist font-bold text-sm shadow-lg hover:bg-[#ffd666] transition-colors">
                                        Check now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item Details */}
                        <div className="px-2 flex flex-col gap-3">
                            {/* Location & Rating */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#4F0000]/60">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-urbanist text-sm">{item.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-[#FFC13C] text-[#FFC13C]" />
                                    <span className="font-urbanist font-semibold text-sm text-[#4F0000]">{item.rating}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#FFC13C]/30">
                                <span className="font-urbanist font-medium text-[#4F0000]/60 text-sm">Starting from</span>
                                <span className="font-poppins font-semibold text-lg text-[#4F0000]">
                                    {item.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
