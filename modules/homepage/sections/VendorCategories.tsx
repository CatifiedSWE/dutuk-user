'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { exploreData } from '@/demo/exploreData';
import { vendorTabs } from '@/demo';
import SectionHeader from '@/components/SectionHeader';

export default function VendorCategories() {
    const [activeTab, setActiveTab] = React.useState('Discover');

    // Filter exploreData to show only vendors
    const vendorData = exploreData.filter(item => item.type === 'vendor');

    return (
        <section className="w-full flex flex-col gap-10">
            {/* Header */}
            <SectionHeader
                label="TOP TIER PROFESSIONALS"
                titleMain="Discover"
                titleAccent="Vendors"
                subtitle="Handpicked professionals for your big day"
            />

            {/* Tabs & Filter */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Scrollable Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                    <div className="flex p-1 bg-[#4F0000]/5 rounded-full">
                        {vendorTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-full font-urbanist font-medium text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab
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
                {vendorData.slice(0, 6).map((vendor, index) => (
                    <Link
                        key={vendor.id}
                        href={`/vendors/profile/${vendor.vendorId || vendor.id}`}
                        className="flex flex-col gap-5 bg-white p-4 rounded-3xl shadow-lg shadow-[#4F0000]/5 hover:shadow-xl hover:shadow-[#4F0000]/10 transition-all duration-300 group cursor-pointer animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Vendor Image Card */}
                        <div className="relative h-60 rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                                src={vendor.image}
                                alt={vendor.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />



                            {/* Check Now Button Overlay (Visible on Hover) */}
                            <div className="absolute inset-x-0 bottom-0 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300">
                                <div className="p-5">
                                    <button className="w-full bg-white text-[#4F0000] py-3 rounded-xl font-urbanist font-bold text-sm shadow-lg hover:bg-[#FDF5E6] transition-colors">
                                        Check Availability
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-2 pb-2 flex flex-col gap-1">
                            {/* Vendor Name */}
                            <h3 className="font-poppins font-semibold text-xl text-[#4F0000]">
                                {vendor.name}
                            </h3>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <span className="font-urbanist font-medium text-[#4F0000]/60">Starting from</span>
                                <span className="font-poppins font-semibold text-xl text-[#4F0000]">
                                    {vendor.price}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
