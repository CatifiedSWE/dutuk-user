'use client';

import React from 'react';
import Image from 'next/image';

interface EventHeroSectionProps {
  title: string;
  coverImage: string;
}

export default function EventHeroSection({ title, coverImage }: EventHeroSectionProps) {
  return (
    <div className="relative w-full h-[320px] md:h-[400px] rounded-[32px] overflow-hidden shadow-lg shadow-[#4F0000]/10 group">
      {/* Dark Background Fallback */}
      <div className="absolute inset-0 bg-gray-900"></div>
      
      {/* Cover Image */}
      <Image
        src={coverImage}
        alt={title}
        fill
        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        priority
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      {/* Title Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight max-w-4xl drop-shadow-lg">
          {title}
        </h1>
      </div>
    </div>
  );
}
