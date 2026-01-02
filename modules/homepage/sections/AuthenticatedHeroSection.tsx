'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';

export default function AuthenticatedHeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { profile, loading } = useCustomerProfile();

    // Get time-based greeting (client-side)
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    // Get first name from full name with better handling
    const firstName = useMemo(() => {
        if (loading) return '...';
        if (!profile?.full_name || profile.full_name.trim() === '') {
            return ''; // Don't show anything if no name
        }
        const name = profile.full_name.trim();
        return name.split(' ')[0];
    }, [profile, loading]);

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
        <section className="relative w-full bg-gradient-to-br from-[#FDF5E6] via-white to-[#FFF8F0] py-12 md:py-20 lg:py-28 -mt-20 md:-mt-24 pt-28 md:pt-44 lg:pt-48">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC13C]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#7C2A2A]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4 md:px-6 flex flex-col items-start md:items-center gap-5 md:gap-8 animate-fadeInUp">
                
                {/* Welcome Badge - Hidden on mobile, shown on desktop */}
                <div className="hidden md:inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#7C2A2A]/15 shadow-md hover:shadow-lg transition-all">
                    <span className="text-xl">👋</span>
                    <span className="font-urbanist font-bold text-xs text-[#7C2A2A] tracking-widest uppercase">Welcome Back</span>
                </div>

                {/* Main Greeting - Left aligned on mobile, center on desktop */}
                <div className="flex flex-col items-start md:items-center gap-3 md:gap-4 w-full max-w-4xl text-left md:text-center">
                    <h1 className="font-['Playfair_Display'] font-bold text-2xl md:text-4xl lg:text-5xl text-[#4F0000] leading-[1.2]">
                        {greeting}{firstName ? ',' : ''} {firstName && <span className="text-[#7C2A2A]">{firstName}</span>}
                        {!firstName && !loading && (
                            <span className="block mt-1 md:mt-2 text-xl md:text-3xl lg:text-4xl">Welcome to Dutuk</span>
                        )}
                    </h1>
                    <p className="font-urbanist font-normal text-xs md:text-base lg:text-lg text-[#4F0000]/60 max-w-2xl leading-relaxed">
                        Ready to plan your next big event?
                    </p>
                </div>

                {/* Search Bar - Left aligned on mobile, center on desktop */}
                <div className="w-full md:max-w-3xl relative group">
                    <div className="relative flex items-center bg-white rounded-full p-2 md:p-2.5 pl-4 md:pl-7 shadow-lg md:shadow-xl border border-[#7C2A2A]/5 md:border-2 transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl hover:border-[#7C2A2A]/15 focus-within:border-[#7C2A2A]/25 focus-within:shadow-xl md:focus-within:shadow-2xl">
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-[#7C2A2A]/40 mr-2 md:mr-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find vendors, venues, or ideas..."
                            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base lg:text-lg text-[#4F0000] placeholder:text-gray-400 font-urbanist py-1"
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn-gradient text-white px-6 md:px-10 py-2.5 md:py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 font-urbanist font-bold text-xs md:text-sm lg:text-base flex-shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
