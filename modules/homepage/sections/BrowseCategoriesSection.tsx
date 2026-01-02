'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, UtensilsCrossed, Camera, Flower2, ArrowRight } from 'lucide-react';

const categories = [
    {
        id: 'venues',
        name: 'Venues',
        icon: Building2,
        color: 'from-[#7C2A2A] to-[#4F0000]',
        href: '/explore?category=venues'
    },
    {
        id: 'catering',
        name: 'Catering',
        icon: UtensilsCrossed,
        color: 'from-[#FFC13C] to-[#FFB020]',
        href: '/explore?category=catering'
    },
    {
        id: 'photo',
        name: 'Photo',
        icon: Camera,
        color: 'from-[#7C2A2A] to-[#4F0000]',
        href: '/explore?category=photography'
    },
    {
        id: 'decor',
        name: 'Decor',
        icon: Flower2,
        color: 'from-[#FFC13C] to-[#FFB020]',
        href: '/explore?category=decoration'
    }
];

export default function BrowseCategoriesSection() {
    return (
        <section className="w-full flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                    Browse <span className="text-[#7C2A2A]">Categories</span>
                </h2>
                <Link 
                    href="/explore"
                    className="flex items-center gap-2 font-urbanist font-semibold text-sm text-[#7C2A2A] hover:text-[#4F0000] transition-colors group"
                >
                    See All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="group relative flex flex-col items-center justify-center gap-4 bg-white rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#7C2A2A]/20 hover:-translate-y-1 animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Icon Container */}
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            </div>
                            
                            {/* Category Name */}
                            <h3 className="font-urbanist font-bold text-lg md:text-xl text-[#4F0000] text-center">
                                {category.name}
                            </h3>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
