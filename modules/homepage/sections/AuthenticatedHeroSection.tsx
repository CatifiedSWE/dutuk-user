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
        <section className="relative w-full bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6] py-12 md:py-20 lg:py-28 -mt-20 md:-mt-24 pt-28 md:pt-44 lg:pt-48">
            {/* Decorative Background Elements - More pronounced on mobile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-5 w-40 h-40 md:w-32 md:h-32 bg-[#FFC13C]/15 rounded-full blur-3xl" />
                <div className="absolute bottom-32 right-5 w-48 h-48 md:w-40 md:h-40 bg-[#7C2A2A]/15 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-10 w-32 h-32 bg-[#FFC13C]/10 rounded-full blur-2xl" />
            </div>

            <div className="relative container mx-auto px-4 md:px-6 flex flex-col items-start md:items-center gap-5 md:gap-8 animate-fadeInUp">
                
                {/* Welcome Badge - Hidden on mobile, shown on desktop */}
                <div className="hidden md:inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#7C2A2A]/20 shadow-lg hover:shadow-xl transition-all">
                    <span className="text-xl">👋</span>
                    <span className="font-urbanist font-bold text-xs text-[#7C2A2A] tracking-widest uppercase">Welcome Back</span>
                </div>

                {/* Main Greeting - Left aligned on mobile, center on desktop */}
                <div className="flex flex-col items-start md:items-center gap-2 md:gap-4 w-full max-w-4xl text-left md:text-center">
                    <h1 className="font-['Playfair_Display'] font-bold text-[28px] leading-tight md:text-4xl lg:text-5xl text-[#4F0000] md:leading-[1.2]">
                        {greeting}{firstName ? ',' : ''} {firstName && <span className="text-[#7C2A2A]">{firstName}</span>}
                        {!firstName && !loading && (
                            <span className="block mt-1 md:mt-2 text-xl md:text-3xl lg:text-4xl">Welcome to Dutuk</span>
                        )}
                    </h1>
                    <p className="font-urbanist font-normal text-[13px] md:text-base lg:text-lg text-[#4F0000]/70 max-w-2xl leading-relaxed">
                        Ready to plan your next big event?
                    </p>
                </div>

                {/* Search Bar - Enhanced mobile design */}
                <div className="w-full md:max-w-3xl relative group">
                    <div className="relative flex items-center bg-white rounded-full p-2 md:p-2.5 pl-4 md:pl-7 shadow-[0_4px_16px_rgba(124,42,42,0.08)] md:shadow-xl border border-[#7C2A2A]/5 md:border-2 transition-all duration-300 hover:shadow-[0_6px_24px_rgba(124,42,42,0.12)] md:hover:shadow-2xl hover:border-[#7C2A2A]/15 focus-within:border-[#7C2A2A]/25 focus-within:shadow-[0_6px_24px_rgba(124,42,42,0.12)] md:focus-within:shadow-2xl">
                        <Search className="w-[18px] h-[18px] md:w-5 md:h-5 text-[#7C2A2A]/40 mr-2 md:mr-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find vendors, venues, or ideas..."
                            className="flex-1 bg-transparent border-none outline-none text-[14px] md:text-base lg:text-lg text-[#4F0000] placeholder:text-[#4F0000]/40 font-urbanist py-1"
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn-gradient text-white px-5 md:px-10 py-2.5 md:py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 font-urbanist font-bold text-[13px] md:text-sm lg:text-base flex-shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
