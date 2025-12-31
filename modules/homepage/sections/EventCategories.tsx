'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';

// Default fallback images for categories based on name/icon
const categoryImageMap: Record<string, string> = {
    // Icon name mappings
    'Heart': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=75',
    'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=75',
    'Camera': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop&q=75',
    'Film': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=600&fit=crop&q=75',
    'Palette': 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop&q=75',
    'Utensils': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop&q=75',
    'PartyPopper': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop&q=75',
    'Sparkles': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop&q=75',
    'Gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&q=75',
    'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&q=75',
    'Star': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop&q=75',
    // Category name mappings
    'Wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=75',
    'Birthday': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop&q=75',
    'Corporate': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop&q=75',
    'DJ': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=75',
    'Photography': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop&q=75',
    'Videography': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=600&fit=crop&q=75',
    'Decoration': 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=600&fit=crop&q=75',
    'Catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop&q=75',
    'Venue': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=600&fit=crop&q=75',
    'Entertainment': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop&q=75',
    'Family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop&q=75',
    'Governance': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=600&fit=crop&q=75',
    'Surprise': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&q=75',
    'Colleges': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=600&fit=crop&q=75',
    'Shoot': 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop&q=75',
};

const defaultCategoryImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop&q=75';

// Helper function to check if a string is a valid URL
function isValidUrl(str: string | null | undefined): boolean {
    if (!str) return false;
    try {
        new URL(str);
        return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
    } catch {
        return false;
    }
}

// Get the appropriate image URL for a category
function getCategoryImage(icon: string | null | undefined, categoryName: string): string {
    // If icon is a valid URL, use it
    if (isValidUrl(icon)) {
        return icon!;
    }
    
    // Try to find a matching image by icon name
    if (icon && categoryImageMap[icon]) {
        return categoryImageMap[icon];
    }
    
    // Try to find a matching image by category name
    if (categoryImageMap[categoryName]) {
        return categoryImageMap[categoryName];
    }
    
    // Return default fallback image
    return defaultCategoryImage;
}

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
                                    src={getCategoryImage(category.icon, category.name)}
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
