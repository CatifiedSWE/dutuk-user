'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';

export default function AuthenticatedHeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { profile } = useCustomerProfile();

    // Get time-based greeting (client-side)
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    // Get first name from full name
    const firstName = useMemo(() => {
        if (!profile?.full_name) return 'there';
        return profile.full_name.split(' ')[0];
    }, [profile]);

    // Handle search
    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/explore');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="relative w-full bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6] py-12 md:py-16 lg:py-20 -mt-20 md:-mt-24 pt-32 md:pt-40">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6 md:gap-8 animate-fadeInUp">
                
                {/* Welcome Badge */}
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#7C2A2A]/10 shadow-sm">
                    <span className="text-2xl">👋</span>
                    <span className="font-urbanist font-semibold text-sm text-[#7C2A2A] tracking-wide uppercase">Welcome Back</span>
                </div>

                {/* Main Greeting */}
                <div className="flex flex-col items-center gap-4 max-w-3xl text-center">
                    <h1 className="font-['Playfair_Display'] font-bold text-4xl md:text-5xl lg:text-6xl text-[#4F0000] leading-tight">
                        {greeting}, <span className="text-[#7C2A2A]">{firstName}</span>
                    </h1>
                    <p className="font-urbanist font-medium text-base md:text-lg text-[#4F0000]/70 max-w-2xl">
                        Ready to plan your next big event? Discover top-rated vendors and venues tailored to your style.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-2xl relative group mt-4">
                    <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-lg border border-[#7C2A2A]/10 transition-all duration-300 hover:shadow-xl hover:border-[#7C2A2A]/20">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find vendors, venues, or ideas..."
                            className="flex-1 bg-transparent border-none outline-none text-base text-[#4F0000] placeholder:text-gray-400 font-urbanist"
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn-gradient text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 font-urbanist font-semibold text-sm"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
