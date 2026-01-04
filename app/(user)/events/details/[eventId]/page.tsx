'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { EventDetailScreen } from '@/modules/events/user';
import { getEventById } from '@/demo/eventsData';
import { useEvent } from '@/hooks/useEvents';
import { EventDetail } from '@/domain/event';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  
  // Try to fetch from Supabase first
  const { event: supabaseEvent, loading, error } = useEvent(eventId);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (loading) return;

    // If found in Supabase, transform it to EventDetail format
    if (supabaseEvent) {
      const transformedEvent: EventDetail = {
        id: supabaseEvent.id,
        title: supabaseEvent.event || 'Untitled Event',
        subtitle: supabaseEvent.company_name || 'Event Details',
        description: supabaseEvent.description || 'No description available',
        coverImage: supabaseEvent.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop&q=80',
        price: supabaseEvent.payment > 0 ? `₹ ${supabaseEvent.payment.toLocaleString()}` : 'Contact for pricing',
        priceNote: '+GST and Platform fee',
        location: supabaseEvent.location || 'Location TBD',
        dateRange: supabaseEvent.start_date && supabaseEvent.end_date 
          ? `${new Date(supabaseEvent.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(supabaseEvent.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : 'Dates TBD',
        vendorName: supabaseEvent.company_name || 'Event Organizer',
        vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=75',
        vendorId: supabaseEvent.vendor_id || '',
        rating: 4.5,
        reviewCount: 0,
        type: 'other',
        services: [
          {
            id: 'default-1',
            name: 'Event Planning',
            icon: 'event',
            priceRange: 'Included'
          }
        ],
        reviews: []
      };
      setEvent(transformedEvent);
    } 
    // If not in Supabase, try demo data
    else {
      const demoEvent = getEventById(eventId);
      if (demoEvent) {
        setEvent(demoEvent);
      } else {
        setNotFoundError(true);
      }
    }
  }, [supabaseEvent, loading, error, eventId]);

  // Show loading state
  if (loading) {
    return (
      <MainLayout variant="solid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
          <div className="space-y-8">
            <LoadingCard height="h-96" />
            <LoadingCard height="h-64" />
            <LoadingCard height="h-48" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error or not found
  if (notFoundError || (!loading && !event)) {
    notFound();
  }

  // Show error message if there's a fetch error
  if (error && !event) {
    return (
      <MainLayout variant="solid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
          <ErrorMessage message="Failed to load event details. Please try again later." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout variant="solid">
      {event && <EventDetailScreen event={event} />}
    </MainLayout>
  );
}
