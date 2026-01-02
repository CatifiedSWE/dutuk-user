'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 'venues',
        name: 'Venues',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=venues'
    },
    {
        id: 'catering',
        name: 'Catering',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=catering'
    },
    {
        id: 'photo',
        name: 'Photo',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=photography'
    },
    {
        id: 'decor',
        name: 'Decor',
        image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=decoration'
    },
    {
        id: 'dj',
        name: 'DJ',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=dj'
    },
    {
        id: 'videography',
        name: 'Videography',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=600&fit=crop&q=75',
        href: '/explore?category=videography'
    }
];

export default function BrowseCategoriesSection() {
    return (
        <section className="w-full flex flex-col gap-6 md:gap-8">
            {/* Header - Left aligned on mobile, space-between on desktop */}
            <div className="flex items-center justify-between">
                <h2 className="font-['Playfair_Display'] font-bold text-[24px] leading-tight md:text-3xl lg:text-4xl text-[#4F0000]">
                    <span className="md:inline">Browse </span><span className="text-[#7C2A2A]">Categories</span>
                </h2>
                <Link 
                    href="/explore"
                    className="flex items-center gap-1.5 md:gap-2 font-urbanist font-semibold text-[12px] md:text-sm text-[#7C2A2A] hover:text-[#4F0000] transition-colors group"
                >
                    See All
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scrollable Categories with enhanced mobile design */}
            <div className="relative -mx-4 md:mx-0">
                <div className="overflow-x-auto scrollbar-hide px-4 md:px-0">
                    <div className="flex gap-5 md:gap-6 lg:gap-8 pb-2">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={category.href}
                                className="flex-shrink-0 w-[120px] md:w-32 lg:w-40 animate-fadeInUp group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col items-center gap-3 md:gap-4">
                                    {/* Image Container with enhanced shadows */}
                                    <div className="relative w-[120px] h-[120px] md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-[0_8px_24px_rgba(124,42,42,0.12)] md:shadow-xl shadow-[#4F0000]/10 group-hover:shadow-[0_12px_32px_rgba(124,42,42,0.18)] md:group-hover:shadow-2xl group-hover:shadow-[#4F0000]/20 transition-all duration-500 group-hover:-translate-y-2 border-[5px] md:border-[5px] border-white/80 backdrop-blur-sm">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            sizes="(max-width: 768px) 120px, (max-width: 1024px) 128px, 160px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                                    </div>
                                    
                                    {/* Category Name with better typography */}
                                    <h3 className="font-poppins font-semibold text-[14px] md:text-base lg:text-lg text-[#4F0000] text-center group-hover:text-[#7C2A2A] transition-colors leading-tight">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
