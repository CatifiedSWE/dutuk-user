'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { premiumEventsData } from '@/demo';

export default function PremiumEventPlanning() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollMap = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="w-full flex flex-col gap-6">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <h2 className="font-poppins font-semibold text-2xl md:text-3xl text-[#4F0000]">
                    Premium Event Planning
                </h2>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollMap('left')}
                        className="p-3 rounded-full bg-[#FFC13C]/80 hover:bg-[#FFC13C] text-[#4F0000] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scrollMap('right')}
                        className="p-3 rounded-full bg-[#FFC13C] text-[#4F0000] hover:bg-[#e6ac34] transition-all shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Events Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory"
            >
                {premiumEventsData.map((event, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[300px] md:w-[340px] bg-white p-3 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 snap-start group"
                    >
                        {/* Event Image */}
                        <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                sizes="340px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />

                            {event.premium && (
                                <div className="absolute left-3 bottom-3 bg-[#FFC13C] px-4 py-1.5 rounded-full shadow-lg">
                                    <span className="font-poppins text-sm text-[#4F0000] font-medium">
                                        Premium
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="px-2 flex flex-col gap-3">
                            <span className="font-inter font-light text-sm md:text-base text-[#535353]">
                                {event.location}
                            </span>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-poppins font-normal text-lg md:text-xl text-[#333333] line-clamp-2">
                                    {event.title}
                                </h3>
                                <span className="font-inter font-semibold text-xl text-[#4F0000]">
                                    {event.price}
                                </span>
                            </div>

                            <button className="w-full bg-[#4F0000] hover:bg-[#600000] text-white py-3 rounded-xl font-urbanist font-bold text-sm transition-colors">
                                Check Availability
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
