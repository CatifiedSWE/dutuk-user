'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/customer-auth';

export interface ReviewData {
  id: string;
  vendor_id: string;
  customer_id: string;
  rating: number;
  review_text: string | null;
  helpful_count: number;
  verified_booking: boolean;
  created_at: string;
  updated_at: string;
}

export function useReviews(vendorId: string) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select('*')
          .eq('vendor_id', vendorId)
          .order('created_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        
        setReviews(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (vendorId) {
      fetchReviews();
    }
  }, [vendorId]);
  
  return { reviews, loading, error };
}

/**
 * Create a new review
 */
export function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  async function createReview(reviewData: {
    vendor_id: string;
    rating: number;
    review_text: string;
  }) {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('You must be logged in to leave a review');
      }
      
      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert({
          vendor_id: reviewData.vendor_id,
          customer_id: user.id,
          rating: reviewData.rating,
          review_text: reviewData.review_text,
          verified_booking: false // This would need additional logic to verify
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }
  
  return { createReview, loading, error };
}
