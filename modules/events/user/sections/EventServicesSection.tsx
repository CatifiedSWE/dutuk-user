'use client';

import React from 'react';
import { EventService } from '@/domain/event';

interface EventServicesSectionProps {
  services: EventService[];
}

export default function EventServicesSection({ services }: EventServicesSectionProps) {
  return (
    <div className="bg-white rounded-[32px] shadow-lg shadow-[#4F0000]/5 p-6 md:p-10 border border-white/50">
      <h3 className="font-serif text-xl font-bold text-[#4F0000] mb-8">Services provided</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-[#FDF5E6] rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-[#7C2A2A]/10"
          >
            {/* Icon Circle */}
            <div className="w-16 h-16 mb-4 rounded-full bg-[#7C2A2A] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[32px]">{service.icon}</span>
            </div>
            
            {/* Service Name */}
            <h4 className="font-bold text-[#4F0000] text-lg mb-2">{service.name}</h4>
            
            {/* Price Range */}
            <p className="text-[#7C2A2A] font-bold text-sm">{service.priceRange}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
