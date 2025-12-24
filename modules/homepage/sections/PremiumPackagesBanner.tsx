'use client';

import React from 'react';
import { Calendar, Package } from 'lucide-react';

export default function PremiumPackagesBanner() {
    return (
        <section className="relative w-full py-10 md:py-20 flex justify-center px-4 overflow-hidden">
            <div className="relative w-full max-w-[1074px] h-[400px] md:h-[330px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/premium-banner.jpg')",
                    }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 md:gap-12 px-6 text-center">
                    <h2 className="font-poppins font-semibold text-2xl md:text-4xl lg:text-[40px] leading-tight md:leading-normal text-white max-w-2xl drop-shadow-lg">
                        Discover premium event plans and packages
                    </h2>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <button className="flex items-center gap-3 bg-white text-[#4F0000] px-6 md:px-8 py-3 rounded-full font-urbanist font-medium text-lg hover:bg-stone-100 transition-colors shadow-lg">
                            <Calendar className="w-5 h-5" />
                            Events
                        </button>

                        <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 md:px-8 py-3 rounded-full font-urbanist font-medium text-lg hover:bg-white/20 transition-colors shadow-lg">
                            <Package className="w-5 h-5" />
                            Packages
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
