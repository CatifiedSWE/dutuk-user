'use client';

import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero-bg.jpg')",
                }}
            />

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center gap-8 md:gap-10 pt-20">
                {/* Main Text Content */}
                <div className="flex flex-col items-center gap-6 max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="font-poppins font-semibold text-3xl md:text-5xl lg:text-[56px] leading-tight md:leading-[1.2] text-white">
                        Let's make your next celebration unforgettable.
                    </h1>
                    <p className="font-urbanist font-medium text-lg md:text-xl text-stone-200 max-w-xl">
                        Explore work from the most talented and accomplished designers ready to take on your next project.
                    </p>
                </div>

                {/* Search Bar - Floating Style */}
                <div className="w-full max-w-[600px] relative group animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    <div className="relative flex items-center bg-white rounded-full p-2 pl-6 shadow-2xl transition-transform hover:scale-[1.01]">
                        <input
                            type="text"
                            placeholder="What type of vendor you want?"
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-[#4F0000] placeholder:text-gray-400 font-urbanist"
                        />
                        <button className="bg-[#7C2A2A] hover:bg-[#963e3e] text-white p-4 rounded-full transition-all duration-300 shadow-md transform group-hover:rotate-[-10deg]">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Category Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <button className="flex items-center gap-3 bg-white text-[#4F0000] px-6 py-3 rounded-full font-urbanist font-medium text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <span className="w-2 h-2 rounded-full bg-[#4F0000]" />
                        Vendors
                    </button>

                    <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-urbanist font-medium text-base hover:bg-white/20 transition-all hover:-translate-y-1">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Events
                    </button>

                    <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-urbanist font-medium text-base hover:bg-white/20 transition-all hover:-translate-y-1">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Packages
                    </button>
                </div>
            </div>
        </section>
    );
}
