'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/customer-auth';

export interface ReviewData {
  id: string;
  vendor_id: string;
  customer_id: string;
  customer_name: string;
  rating: number;
  review: string | null;
  event_name: string | null;
  event_date: string | null;
  helpful_count: number;
  verified_booking: boolean;
  created_at: string;
  updated_at: string;
  response: string | null;
  response_at: string | null;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason: string | null;
  order: {
    id: string;
    title: string;
    event_date: string;
  } | null;
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
 * Check if the current user is eligible to review a vendor
 * Requirements:
 * 1. User must have a completed (approved) booking with the vendor
 * 2. The event date must have passed (event is completed)
 * 3. User must not have already reviewed this vendor for this order
 */
export function useReviewEligibility(vendorId: string) {
  const [eligibility, setEligibility] = useState<ReviewEligibility>({
    canReview: false,
    reason: null,
    order: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkEligibility = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const user = await getCurrentUser();

      if (!user) {
        setEligibility({
          canReview: false,
          reason: 'You must be logged in to leave a review',
          order: null,
        });
        return;
      }

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Find completed orders for this vendor (approved orders with past event date)
      const { data: completedOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, title, event_date')
        .eq('vendor_id', vendorId)
        .eq('customer_id', user.id)
        .eq('status', 'approved')
        .lt('event_date', today)
        .order('event_date', { ascending: false });

      if (ordersError) throw ordersError;

      if (!completedOrders || completedOrders.length === 0) {
        setEligibility({
          canReview: false,
          reason: 'You can only review after completing an event with this vendor',
          order: null,
        });
        return;
      }

      // Check if user has already reviewed this vendor
      const { data: existingReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, event_id')
        .eq('vendor_id', vendorId)
        .eq('customer_id', user.id);

      if (reviewsError) throw reviewsError;

      // Find an order that hasn't been reviewed yet
      const reviewedOrderIds = new Set(
        (existingReviews || []).map((r) => r.event_id).filter(Boolean)
      );

      const reviewableOrder = completedOrders.find(
        (order) => !reviewedOrderIds.has(order.id)
      );

      if (!reviewableOrder) {
        setEligibility({
          canReview: false,
          reason: 'You have already reviewed all your completed events with this vendor',
          order: null,
        });
        return;
      }

      setEligibility({
        canReview: true,
        reason: null,
        order: reviewableOrder,
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error checking review eligibility:', err);
      setEligibility({
        canReview: false,
        reason: 'An error occurred while checking eligibility',
        order: null,
      });
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      checkEligibility();
    }
  }, [vendorId, checkEligibility]);

  return { eligibility, loading, error, refetch: checkEligibility };
}

/**
 * Create a new review with verified booking validation
 */
export function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function createReview(reviewData: {
    vendor_id: string;
    order_id: string;
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

      // Verify the order exists and belongs to this user
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, title, event_date, status')
        .eq('id', reviewData.order_id)
        .eq('customer_id', user.id)
        .eq('vendor_id', reviewData.vendor_id)
        .single();

      if (orderError || !order) {
        throw new Error('Order not found or does not belong to you');
      }

      // Verify the order was approved
      if (order.status !== 'approved' && order.status !== 'completed') {
        throw new Error('You can only review approved bookings');
      }

      // Verify the event date has passed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(order.event_date);

      if (eventDate >= today) {
        throw new Error('You can only review after the event has completed');
      }

      // Check if already reviewed this order
      const { data: existingReview, error: existingError } = await supabase
        .from('reviews')
        .select('id')
        .eq('vendor_id', reviewData.vendor_id)
        .eq('customer_id', user.id)
        .eq('event_id', reviewData.order_id)
        .maybeSingle();

      if (existingReview) {
        throw new Error('You have already reviewed this event');
      }

      // Get user's name for the review
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';

      // Create the review with verified_booking = true
      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert({
          vendor_id: reviewData.vendor_id,
          customer_id: user.id,
          customer_name: userName,
          event_id: reviewData.order_id,
          event_name: order.title,
          event_date: order.event_date,
          rating: reviewData.rating,
          review: reviewData.review_text,
          verified_booking: true, // Set to true because we verified the booking
          helpful_count: 0,
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
