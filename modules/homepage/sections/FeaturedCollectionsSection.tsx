'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, Briefcase } from 'lucide-react';

const collections = [
    {
        id: '1',
        badge: 'Trending',
        badgeIcon: TrendingUp,
        title: 'Summer Wedding Packages',
        subtitle: 'Total Package',
        description: 'Starting from $1,500',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80',
        href: '/explore?collection=summer-wedding'
    },
    {
        id: '2',
        badge: 'Corporate',
        badgeIcon: Briefcase,
        title: 'Business Retreats',
        subtitle: 'Limited Time Offer',
        description: 'Book early for 15% off',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80',
        href: '/explore?collection=corporate'
    },
    {
        id: '3',
        badge: 'Popular',
        badgeIcon: TrendingUp,
        title: 'Birthday Celebrations',
        subtitle: 'Complete Package',
        description: 'From $800',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop&q=80',
        href: '/explore?collection=birthday'
    }
];

export default function FeaturedCollectionsSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition = direction === 'left' 
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;
            
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="w-full flex flex-col gap-8">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                        Featured <span className="text-[#7C2A2A]">Collections</span>
                    </h2>
                    <p className="font-urbanist text-sm text-[#4F0000]/60 mt-2">Curated packages just for you</p>
                </div>
                
                {/* Navigation Arrows - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-white border border-[#7C2A2A]/20 flex items-center justify-center hover:bg-[#7C2A2A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <ChevronLeft className="w-5 h-5 text-[#7C2A2A] group-hover:text-white" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-white border border-[#7C2A2A]/20 flex items-center justify-center hover:bg-[#7C2A2A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        <ChevronRight className="w-5 h-5 text-[#7C2A2A] group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Collections Carousel */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
            >
                {collections.map((collection, index) => {
                    const BadgeIcon = collection.badgeIcon;
                    return (
                        <Link
                            key={collection.id}
                            href={collection.href}
                            className="group relative flex-shrink-0 w-[320px] md:w-[400px] h-[280px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background Image */}
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 320px, 400px"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#FFC13C] text-[#4F0000] px-4 py-2 rounded-full shadow-lg">
                                <BadgeIcon className="w-4 h-4" />
                                <span className="font-urbanist font-bold text-xs uppercase tracking-wide">{collection.badge}</span>
                            </div>
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                                <h3 className="font-['Playfair_Display'] font-bold text-2xl text-white">
                                    {collection.title}
                                </h3>
                                <p className="font-urbanist font-semibold text-sm text-white/90">
                                    {collection.subtitle}
                                </p>
                                <p className="font-urbanist font-medium text-sm text-white/80">
                                    {collection.description}
                                </p>
                                
                                {/* CTA Button */}
                                <div className="mt-2 inline-flex items-center gap-2 text-[#FFC13C] font-urbanist font-semibold text-sm group-hover:gap-3 transition-all">
                                    Explore Package
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
