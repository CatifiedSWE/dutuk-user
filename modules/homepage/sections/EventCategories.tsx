'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';

export default function EventCategories() {
    // Fetch categories from Supabase
    const { categories, loading, error } = useCategories();
    
    // Show loading state
    if (loading) {
        return (
            <section className="w-full flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                            Event categories
                        </h2>
                        <p className="font-urbanist text-[#4F0000]/70 text-lg">
                            Discover the perfect setting for your celebration
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 justify-items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-full max-w-[180px]">
                            <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded mt-5 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }
    
    // Show error state
    if (error) {
        return (
            <section className="w-full flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                            Event categories
                        </h2>
                        <p className="font-urbanist text-[#4F0000]/70 text-lg">
                            Discover the perfect setting for your celebration
                        </p>
                    </div>
                </div>
                <ErrorMessage message="Failed to load categories. Please try again later." />
            </section>
        );
    }
    
    // Show empty state
    if (!categories || categories.length === 0) {
        return (
            <section className="w-full flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                            Event categories
                        </h2>
                        <p className="font-urbanist text-[#4F0000]/70 text-lg">
                            Discover the perfect setting for your celebration
                        </p>
                    </div>
                </div>
                <EmptyState message="No categories available at the moment." />
            </section>
        );
    }

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="font-['Playfair_Display'] font-bold text-3xl md:text-4xl text-[#4F0000]">
                        Event categories
                    </h2>
                    <p className="font-urbanist text-[#4F0000]/70 text-lg">
                        Discover the perfect setting for your celebration
                    </p>
                </div>
                <Link
                    href="/explore"
                    className="group flex items-center gap-2 font-urbanist font-medium text-lg text-[#4F0000] hover:text-[#7C2A2A] transition-colors"
                >
                    <span>See all categories</span>
                    <div className="bg-[#4F0000]/10 p-2 rounded-full group-hover:bg-[#4F0000] group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 justify-items-center">
                {categories.slice(0, 5).map((category, index) => (
                    <div
                        key={category.id}
                        className="flex flex-col items-center gap-5 w-full max-w-[180px] animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <Link 
                            href={`/explore?filter=Vendors&category=${category.slug}`}
                            className="flex flex-col items-center gap-5 group cursor-pointer w-full"
                        >
                            <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-xl shadow-[#4F0000]/10 group-hover:shadow-2xl group-hover:shadow-[#4F0000]/20 transition-all duration-500 group-hover:-translate-y-2 border-[5px] border-white">
                                <Image
                                    src={category.icon || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop&q=75'}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 768px) 150px, 180px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                            </div>
                            <span className="font-poppins font-medium text-xl text-[#4F0000] text-center group-hover:text-[#7C2A2A] transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
