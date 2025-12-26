'use client';

import React from 'react';
import { EventDetail } from '@/domain/event';
import EventHeroSection from './sections/EventHeroSection';
import EventInfoSection from './sections/EventInfoSection';
import EventServicesSection from './sections/EventServicesSection';
import EventReviewsSection from './sections/EventReviewsSection';

interface EventDetailScreenProps {
  event: EventDetail;
}

export default function EventDetailScreen({ event }: EventDetailScreenProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        {/* Hero Section */}
        <EventHeroSection
          title={event.title}
          coverImage={event.coverImage}
        />

        {/* Event Info Section */}
        <EventInfoSection
          title={event.title}
          subtitle={event.subtitle}
          price={event.price}
          priceNote={event.priceNote}
        />

        {/* Services Section */}
        <EventServicesSection services={event.services} />

        {/* Reviews Section */}
        <EventReviewsSection
          reviews={event.reviews}
          rating={event.rating}
          reviewCount={event.reviewCount}
        />
      </div>
    </div>
  );
}
