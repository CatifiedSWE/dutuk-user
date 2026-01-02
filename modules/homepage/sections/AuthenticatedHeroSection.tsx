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
        <section className="relative w-full bg-gradient-to-br from-[#FDF5E6] via-white to-[#FFF8F0] py-16 md:py-20 lg:py-24 -mt-20 md:-mt-24 pt-32 md:pt-40">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC13C]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#7C2A2A]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto px-4 flex flex-col items-center justify-center gap-8 md:gap-10 animate-fadeInUp">
                
                {/* Welcome Badge */}
                <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#7C2A2A]/15 shadow-md hover:shadow-lg transition-all">
                    <span className="text-xl">👋</span>
                    <span className="font-urbanist font-bold text-xs text-[#7C2A2A] tracking-widest uppercase">Welcome Back</span>
                </div>

                {/* Main Greeting */}
                <div className="flex flex-col items-center gap-5 max-w-4xl text-center">
                    <h1 className="font-['Playfair_Display'] font-bold text-4xl md:text-5xl lg:text-7xl text-[#4F0000] leading-[1.1]">
                        {greeting}{firstName ? ',' : ''} {firstName && <span className="text-[#7C2A2A]">{firstName}</span>}
                        {!firstName && !loading && (
                            <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl">Welcome to Dutuk</span>
                        )}
                    </h1>
                    <p className="font-urbanist font-medium text-base md:text-lg lg:text-xl text-[#4F0000]/60 max-w-2xl leading-relaxed">
                        Ready to plan your next big event? Discover top-rated vendors and venues tailored to your style.
                    </p>
                </div>

                {/* Search Bar - Improved Design */}
                <div className="w-full max-w-3xl relative group mt-2">
                    <div className="relative flex items-center bg-white rounded-full p-2.5 pl-7 shadow-xl border-2 border-[#7C2A2A]/5 transition-all duration-300 hover:shadow-2xl hover:border-[#7C2A2A]/15 focus-within:border-[#7C2A2A]/25 focus-within:shadow-2xl">
                        <Search className="w-5 h-5 text-[#7C2A2A]/40 mr-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Find vendors, venues, or ideas..."
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-[#4F0000] placeholder:text-gray-400 font-urbanist py-1"
                        />
                        <button 
                            onClick={handleSearch}
                            className="btn-gradient text-white px-10 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 font-urbanist font-bold text-sm md:text-base flex-shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
