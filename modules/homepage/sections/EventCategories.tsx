'use client';

import React from 'react';
import Link from 'next/link';
import { eventCategoriesData } from '@/demo';

export default function EventCategories() {
    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#4F0000]/10 pb-4">
                <h2 className="font-urbanist font-semibold text-3xl md:text-4xl text-[#4F0000]">
                    Event categories
                </h2>
                <Link
                    href="#"
                    className="font-urbanist text-lg md:text-xl text-black hover:text-[#7C2A2A] transition-colors underline-offset-4 hover:underline"
                >
                    See all
                </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 justify-items-center">
                {eventCategoriesData.map((category, index) => (
                    <Link
                        href="#"
                        key={index}
                        className="flex flex-col items-center gap-4 group cursor-pointer"
                    >
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-4 border-white">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${category.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>
                        <span className="font-urbanist font-semibold text-xl md:text-2xl text-[#4F0000] text-center group-hover:text-[#7C2A2A] transition-colors">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
