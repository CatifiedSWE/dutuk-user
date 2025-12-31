'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ServiceData {
  id: string;
  vendor_id: string;
  company_id: string;
  service_name: string;
  service_type: string;
  description: string | null;
  short_description: string | null;
  base_price: number;
  price_type: string;
  currency: string;
  featured_image: string | null;
  gallery_images: string[] | null;
  tags: string[] | null;
  category: string;
  subcategory: string | null;
  is_active: boolean;
  max_bookings_per_day: number;
  created_at: string;
  updated_at: string;
}

export function useVendorServices(options?: {
  vendorId?: string;
  category?: string;
  serviceType?: string;
  limit?: number;
}) {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('vendor_services')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (options?.vendorId) {
          query = query.eq('vendor_id', options.vendorId);
        }
        
        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.serviceType) {
          query = query.eq('service_type', options.serviceType);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setServices(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, [options?.vendorId, options?.category, options?.serviceType, options?.limit]);
  
  return { services, loading, error };
}

/**
 * Get a single service by ID
 */
export function useService(serviceId: string) {
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('vendor_services')
          .select('*')
          .eq('id', serviceId)
          .single();
        
        if (fetchError) throw fetchError;
        
        setService(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);
  
  return { service, loading, error };
}
