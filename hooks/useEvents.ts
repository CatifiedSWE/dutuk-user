'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Event data structure matching Supabase events table
export interface EventData {
  id: string;
  customer_id: string;
  customer_name: string | null;
  company_name: string;
  vendor_id: string | null;
  event: string; // This is the event title/name
  description: string | null;
  date: string[]; // Array of dates
  payment: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  location: string | null; // Event location/venue
  image_url: string | null; // Event banner image
  created_at: string;
  updated_at: string;
}

/**
 * Fetch events from Supabase events table
 */
export function useEvents(options?: {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  searchQuery?: string;
  limit?: number;
  vendorId?: string;
}) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Filter by status if provided (default to show all)
        if (options?.status) {
          query = query.eq('status', options.status);
        }
        
        // Filter by vendor ID if provided
        if (options?.vendorId) {
          query = query.eq('vendor_id', options.vendorId);
        }
        
        // Search by event name or company name
        if (options?.searchQuery) {
          query = query.or(`event.ilike.%${options.searchQuery}%,company_name.ilike.%${options.searchQuery}%`);
        }
        
        // Limit results if specified
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setEvents(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [options?.status, options?.searchQuery, options?.limit, options?.vendorId]);
  
  return { events, loading, error };
}

/**
 * Get a single event by ID
 */
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
        // Only throw error if it's not a "not found" error
        if (fetchError) {
          // PGRST116 is the error code for "no rows returned" from .single()
          if (fetchError.code === 'PGRST116') {
            console.log('Event not found in database:', eventId);
            setEvent(null);
          } else {
            throw fetchError;
          }
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  
  return { event, loading, error };
}

/**
 * Get upcoming events (status = 'upcoming')
 */
export function useUpcomingEvents(limit?: number) {
  return useEvents({ status: 'upcoming', limit });
}

/**
 * Get events by vendor
 */
export function useVendorEvents(vendorId: string, limit?: number) {
  return useEvents({ vendorId, limit });
}
