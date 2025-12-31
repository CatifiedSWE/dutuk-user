'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/customer-auth';

export interface BookingRequestData {
  company_name: string;
  event_type: string;
  description: string;
  dates: string;
  estimated_budget: string;
  customer_name: string;
  customer_phone: string;
  location?: string;
  guest_count?: number;
}

export function useBookingRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  async function createRequest(requestData: BookingRequestData) {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('You must be logged in to send a booking request');
      }
      
      const { data, error: insertError } = await supabase
        .from('requests')
        .insert({
          customer_id: user.id,
          customer_name: requestData.customer_name,
          customer_email: user.email,
          customer_phone: requestData.customer_phone,
          company_name: requestData.company_name,
          event: requestData.event_type,
          description: requestData.description,
          date: requestData.dates,
          payment: requestData.estimated_budget,
          location: requestData.location,
          guest_count: requestData.guest_count,
          status: 'pending'
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating booking request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  return { createRequest, loading, error };
}

/**
 * Get all booking requests for current user
 */
export function useMyBookingRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  async function fetchRequests() {
    try {
      setLoading(true);
      const supabase = createClient();
      const user = await getCurrentUser();
      
      if (!user) {
        setRequests([]);
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setRequests(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching booking requests:', err);
    } finally {
      setLoading(false);
    }
  }
  
  return { requests, loading, error, refetch: fetchRequests };
}
