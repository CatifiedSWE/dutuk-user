'use client';

import React from 'react';

interface EventInfoSectionProps {
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
}

export default function EventInfoSection({ title, subtitle, price, priceNote }: EventInfoSectionProps) {
  return (
    <div className="bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 p-6 md:p-10 border border-white/50">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
        {/* Left: Event Info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#7C2A2A] mb-3">
              {title}
            </h2>
            <p className="text-[#4F0000]/70 text-base md:text-lg font-medium">
              {subtitle}
            </p>
          </div>
          
          {/* CTA Button */}
          <button className="bg-[#7C2A2A] hover:bg-[#5A1F1F] text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg shadow-[#7C2A2A]/20 active:scale-95 w-full md:w-auto justify-center md:justify-start">
            <span className="material-symbols-outlined">calendar_month</span>
            Check availability
          </button>
        </div>
        
        {/* Right: Price */}
        <div className="flex flex-col items-start lg:items-end border-t lg:border-t-0 border-gray-100 pt-6 lg:pt-0">
          <div className="text-3xl md:text-4xl font-bold text-[#7C2A2A] mb-1">
            {price}
          </div>
          <div className="text-xs font-semibold text-[#4F0000]/60 uppercase tracking-wider">
            {priceNote}
          </div>
        </div>
      </div>
    </div>
  );
}
