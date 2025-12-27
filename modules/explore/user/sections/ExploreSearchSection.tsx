'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { filterOptions } from '@/demo/exploreData';

interface ExploreSearchSectionProps {
    selectedFilter: 'All' | 'Vendors' | 'Events' | 'Packages';
    onFilterChange: (filter: 'All' | 'Vendors' | 'Events' | 'Packages') => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function ExploreSearchSection({ 
    selectedFilter, 
    onFilterChange,
    searchQuery,
    onSearchChange
}: ExploreSearchSectionProps) {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Sync local state with prop when it changes
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleClear = () => {
        setLocalSearchQuery('');
        onSearchChange('');
    };

    const handleFilterSelect = (filter: string) => {
        onFilterChange(filter as 'All' | 'Vendors' | 'Events' | 'Packages');
        setIsDropdownOpen(false);
    };

    const handleSearch = () => {
        onSearchChange(localSearchQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="w-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-poppins font-bold text-4xl md:text-5xl text-[#4F0000]">
                    Explore
                </h1>
                <p className="font-urbanist text-[#4F0000]/70 text-lg">
                    {searchQuery 
                        ? `Showing results for "${searchQuery}"` 
                        : 'Discover the best vendors, packages, and events for your special occasions'
                    }
                </p>
            </div>

            {/* Search Box with Filters */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-lg shadow-[#4F0000]/5">
                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between gap-3 bg-[#4F0000]/5 text-[#4F0000] px-6 py-3 rounded-xl hover:bg-[#4F0000]/10 transition-all duration-300 font-urbanist font-medium text-sm min-w-[140px] border border-[#4F0000]/10"
                    >
                        <span>{selectedFilter}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-[#4F0000]/10 overflow-hidden z-10 animate-fadeIn">
                            {filterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleFilterSelect(option)}
                                    className={`w-full text-left px-6 py-3 font-urbanist text-sm transition-colors ${
                                        selectedFilter === option
                                            ? 'bg-[#4F0000] text-white'
                                            : 'text-[#4F0000] hover:bg-[#FDF5E6]'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-4 text-[#4F0000]/40 w-5 h-5" />
                    <input
                        type="text"
                        value={localSearchQuery}
                        onChange={(e) => setLocalSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for vendors, packages, or events..."
                        className="w-full bg-[#FDF5E6] text-[#4F0000] placeholder:text-[#4F0000]/40 pl-12 pr-12 py-3 rounded-xl outline-none font-urbanist font-medium border border-[#4F0000]/10 focus:border-[#4F0000]/30 transition-all"
                    />
                    {localSearchQuery && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 text-[#4F0000]/60 hover:text-[#4F0000] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSearch}
                        className="flex items-center justify-center gap-2 bg-[#4F0000] text-white px-8 py-3 rounded-xl hover:bg-[#7C2A2A] transition-all duration-300 font-urbanist font-semibold text-sm shadow-md hover:scale-105 active:scale-95"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white text-[#4F0000] border border-[#4F0000]/20 px-6 py-3 rounded-xl hover:bg-[#FDF5E6] transition-all duration-300 font-urbanist font-medium text-sm shadow-sm hover:scale-105 active:scale-95">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
