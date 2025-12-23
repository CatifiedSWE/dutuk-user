'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const categories = [
    { name: 'Disc Jockey (DJ)', price: '₹ 10,000 - ₹ 60,000', color: '#8B5CF6' },
    { name: 'Photographer', price: '₹ 10,000 - ₹ 1,00,000', color: '#EC4899' },
    { name: 'Decorators', price: '₹ 30,000 - ₹ 1,50,000', color: '#F59E0B' },
    { name: 'Decorators', price: '₹ 30,000 - ₹ 1,50,000', color: '#10B981' },
    { name: 'Catering', price: '₹ 15,000 - ₹ 1,00,000', color: '#3B82F6' },
    { name: 'Music / Entertainment', price: '₹ 30,000 - ₹ 1,50,000', color: '#EF4444' },
];

const tabs = ['Discover', 'Event Planner', 'DJ', 'Catering', 'Photographer', 'Decoration', 'Printmaker'];

export default function VendorCategories() {
    const [activeTab, setActiveTab] = useState('Discover');

    return (
        <section className="w-full flex flex-col gap-8">
            {/* Header */}
            <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-[#4F0000]">
                Vendor Categories
            </h2>

            {/* Tabs & Filter */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Scrollable Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(tab)}
                            className={`
                whitespace-nowrap px-6 py-2 rounded-full font-[urbanist] font-medium text-sm transition-all
                ${activeTab === tab
                                    ? 'bg-[#4F0000] text-white shadow-md'
                                    : 'bg-transparent text-[#4F0000] hover:bg-[#4F0000]/5'
                                }
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 bg-[#4F0000] text-white px-6 py-2 rounded-full hover:bg-[#600000] transition-colors shadow-md ml-auto lg:ml-0">
                    <Filter className="w-4 h-4" />
                    <span className="font-[urbanist] font-medium text-sm">Filter</span>
                </button>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((vendor, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-4 bg-white p-4 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Vendor Image Card */}
                        <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                style={{
                                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(135deg, ${vendor.color}, ${vendor.color}dd)`
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <span className="font-poppins font-medium text-xl text-white text-center drop-shadow-md">
                                    {vendor.name}
                                </span>
                            </div>

                            {/* Check Now Button Overlay (Visible on Hover) */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className="w-full bg-[#4F0000] text-white py-2 rounded-xl font-[urbanist] font-medium text-sm shadow-lg">
                                    Check now
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="px-2 pb-2">
                            <span className="font-[inter] font-semibold text-lg md:text-xl text-[#4F0000]">
                                {vendor.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
