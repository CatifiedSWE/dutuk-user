'use client';

import { Suspense, useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { EventDetailScreen } from '@/modules/events/user';
import { getEventById } from '@/demo/eventsData';
import { useEvent } from '@/hooks/useEvents';
import { EventDetail } from '@/domain/event';
import { LoadingCard } from '@/components/LoadingCard';
import { ErrorMessage } from '@/components/ErrorMessage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function EventDetailContent() {
  const params = useParams();
  const eventId = params.eventId as string;
  
  // Try to fetch from Supabase first
  const { event: supabaseEvent, loading, error } = useEvent(eventId);
  const [event, setEvent] = useState<EventDetail | null>(null);
  // Track when we've finished processing all data sources
  const [dataProcessed, setDataProcessed] = useState(false);
  const [shouldShow404, setShouldShow404] = useState(false);

  useEffect(() => {
    // Don't process until Supabase loading is complete
    if (loading) {
      return;
    }

    console.log('Event fetch completed:', { 
      eventId, 
      supabaseEvent: supabaseEvent ? 'found' : 'not found', 
      error: error ? error.message : 'no error' 
    });

    // If found in Supabase, transform it to EventDetail format
    if (supabaseEvent) {
      console.log('Transforming Supabase event:', supabaseEvent.event);
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
      setDataProcessed(true);
    } 
    // If not in Supabase, try demo data (only if no fetch error)
    else if (!error) {
      const demoEvent = getEventById(eventId);
      if (demoEvent) {
        console.log('Using demo event data for:', eventId);
        setEvent(demoEvent);
        setDataProcessed(true);
      } else {
        // Event not found in either Supabase or demo data
        console.log('Event not found in Supabase or demo data:', eventId);
        setShouldShow404(true);
        setDataProcessed(true);
      }
    } else {
      // There was a fetch error - mark as processed but don't 404
      console.log('Fetch error occurred:', error.message);
      setDataProcessed(true);
    }
  }, [supabaseEvent, loading, error, eventId]);

  // Show loading state while fetching OR while processing data
  if (loading || (!dataProcessed && !error)) {
    return (
      <MainLayout variant="solid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
          <div className="space-y-8">
            <LoadingCard className="h-96" />
            <LoadingCard className="h-64" />
            <LoadingCard className="h-48" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show 404 only after we've confirmed event doesn't exist in any source
  if (shouldShow404) {
    notFound();
  }

  // Show error message if there's a fetch error and no event
  if (error && !event) {
    return (
      <MainLayout variant="solid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
          <ErrorMessage message="Failed to load event details. Please try again later." />
        </div>
      </MainLayout>
    );
  }

  // Show event details
  if (event) {
    return (
      <MainLayout variant="solid">
        <EventDetailScreen event={event} />
      </MainLayout>
    );
  }

  // Fallback loading (should not reach here normally)
  return (
    <MainLayout variant="solid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        <div className="space-y-8">
          <LoadingCard className="h-96" />
          <LoadingCard className="h-64" />
          <LoadingCard className="h-48" />
        </div>
      </div>
    </MainLayout>
  );
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] via-[#FFF8F0] to-[#FDF5E6]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
          <p className="text-sm text-[#4F0000]/60">Loading event...</p>
        </div>
      </div>
    }>
      <EventDetailContent />
    </Suspense>
  );
}
