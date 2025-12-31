'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface VendorData {
  id: string;
  user_id: string;
  company: string;
  description: string | null;
  logo_url: string | null;
  category: string | null;
  subcategories: string[] | null;
  service_area: string | null;
  avg_rating: number;
  total_reviews: number;
  years_in_business: number | null;
  is_active: boolean;
  verified_at: string | null;
  created_at: string;
}

export function useVendors(options?: {
  category?: string;
  searchQuery?: string;
  limit?: number;
}) {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchVendors() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        let query = supabase
          .from('companies')
          .select('*')
          .eq('is_active', true)
          .order('avg_rating', { ascending: false });
        
        if (options?.category) {
          query = query.eq('category', options.category);
        }
        
        if (options?.searchQuery) {
          query = query.ilike('company', `%${options.searchQuery}%`);
        }
        
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setVendors(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendors();
  }, [options?.category, options?.searchQuery, options?.limit]);
  
  return { vendors, loading, error };
}

/**
 * Get a single vendor by ID
 */
export function useVendor(vendorId: string) {
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchVendor() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', vendorId)
          .single();
        
        if (fetchError) throw fetchError;
        
        setVendor(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching vendor:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);
  
  return { vendor, loading, error };
}
