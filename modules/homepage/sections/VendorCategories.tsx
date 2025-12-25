'use client';

import React, { useState } from 'react';
import { Filter, Star } from 'lucide-react';
import { vendorCategoriesData, vendorTabs } from '@/demo';

export default function VendorCategories() {
    const [activeTab, setActiveTab] = useState('Discover');

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="font-poppins font-semibold text-3xl md:text-4xl text-[#4F0000]">
                    Top Vendors
                </h2>
                <p className="font-urbanist text-[#4F0000]/70 text-lg">
                    Handpicked professionals for your big day
                </p>
            </div>

            {/* Tabs & Filter */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Scrollable Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div className="flex p-1 bg-[#4F0000]/5 rounded-full">
                        {vendorTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-full font-urbanist font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                                    activeTab === tab 
                                        ? 'bg-[#4F0000] text-white shadow-md' 
                                        : 'text-[#4F0000] hover:text-[#4F0000]/80'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 bg-white text-[#4F0000] border border-[#4F0000]/10 px-6 py-3 rounded-full hover:bg-[#FDF5E6] hover:border-[#4F0000]/20 transition-all duration-300 shadow-sm ml-auto lg:ml-0 hover:scale-105 active:scale-95">
                    <Filter className="w-4 h-4" />
                    <span className="font-urbanist font-medium text-sm">Filter</span>
                </button>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {vendorCategoriesData.map((vendor, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-5 bg-white p-4 rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 group cursor-pointer animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Vendor Image Card */}
                        <div className="relative h-60 rounded-2xl overflow-hidden bg-gray-100">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url(${vendor.image})`
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute top-3 right-3 bg-white/25 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                4.9
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                                <span className="font-poppins font-semibold text-2xl text-white drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {vendor.name}
                                </span>

                                {/* Check Now Button Overlay (Visible on Hover) */}
                                <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300">
                                    <div className="pt-4">
                                        <button className="w-full bg-white text-[#4F0000] py-3 rounded-xl font-urbanist font-bold text-sm shadow-lg hover:bg-[#FDF5E6] transition-colors">
                                            Check Availability
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="px-2 flex items-center justify-between">
                            <span className="font-urbanist font-medium text-[#4F0000]/60">Starting from</span>
                            <span className="font-poppins font-semibold text-xl text-[#4F0000]">
                                {vendor.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
