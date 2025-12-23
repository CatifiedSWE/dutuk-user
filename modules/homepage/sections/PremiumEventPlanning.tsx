'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const events = [
    {
        title: 'ECR Beach House Wedding',
        location: 'Chennai, Egmore',
        price: '₹ 2,00,000 - ₹ 5,00,000',
        color: '#06B6D4',
        premium: true
    },
    {
        title: 'ITC Grand Chola - All Events',
        location: 'Chennai, Egmore',
        price: '₹ 2,80,000 - ₹ 7,00,000',
        color: '#8B5CF6',
        premium: true
    },
    {
        title: 'Sterling Ooty Resort - Events',
        location: 'Chennai, Egmore',
        price: '₹ 2,00,000 - ₹ 4,00,000',
        color: '#10B981',
        premium: true
    },
    {
        title: 'Leela Palace Grand Ball',
        location: 'Chennai, MRC Nagar',
        price: '₹ 5,00,000 - ₹ 12,00,000',
        color: '#F59E0B',
        premium: true
    },
];

export default function PremiumEventPlanning() {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[300px] md:w-[340px] bg-white p-3 rounded-[24px] shadow-sm hover:shadow-lg transition-all duration-300 snap-start group"
                    >
                        {/* Event Image */}
                        <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                            <div
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)` }}
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
                            <span className="font-[inter] font-light text-sm md:text-base text-[#535353]">
                                {event.location}
                            </span>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-poppins font-normal text-lg md:text-xl text-[#333333] line-clamp-2">
                                    {event.title}
                                </h3>
                                <span className="font-[inter] font-semibold text-xl text-[#4F0000]">
                                    {event.price}
                                </span>
                            </div>

                            {/* Check Now Button */}
                            <button className="w-full mt-2 bg-[#FFC13C] text-[#4F0000] py-2.5 rounded-full font-poppins font-semibold text-lg hover:bg-[#e6ac34] transition-colors shadow-sm">
                                Check now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
