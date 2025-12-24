'use client';

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const bundles = [
    {
        title: 'Birthday Party for 100 people',
        price: '₹ 2,00,000 - ₹ 5,00,000',
        image: '/bundles/birthday.jpg'
    },
    {
        title: 'Wedding Bundle for 300 people',
        price: '₹ 2,80,000 - ₹ 7,00,000',
        image: '/bundles/wedding.jpg'
    },
    {
        title: 'Corporate event for 300 people',
        price: '₹ 2,00,000 - ₹ 4,00,000',
        image: '/bundles/corporate.jpg'
    },
    {
        title: 'Engagement Party',
        price: '₹ 1,50,000 - ₹ 3,00,000',
        image: '/bundles/engagement.jpg'
    },
];

export default function BundleServices() {
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
                    Bundle Services
                </h2>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollMap('left')}
                        className="p-3 rounded-full bg-[#FFFFFF]/80 hover:bg-[#4F0000] text-[#4F0000] hover:text-white transition-all shadow-sm border border-[#4F0000]/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scrollMap('right')}
                        className="p-3 rounded-full bg-[#4F0000] text-white hover:bg-[#600000] transition-all shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bundles Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory"
            >
                {bundles.map((bundle, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[300px] md:w-[340px] bg-white p-3 rounded-[24px] shadow-sm hover:shadow-md transition-shadow snap-start"
                    >
                        {/* Bundle Image */}
                        <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                            <div
                                className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url(${bundle.image})` }}
                            />
                        </div>

                        {/* Content */}
                        <div className="px-2 flex flex-col gap-2">
                            <span className="font-inter font-light text-sm md:text-base text-[#535353]">
                                Chennai, Egmore
                            </span>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-poppins font-normal text-lg md:text-xl text-[#333333] line-clamp-2 min-h-[56px]">
                                    {bundle.title}
                                </h3>
                                <span className="font-inter font-semibold text-xl text-[#4F0000]">
                                    {bundle.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
