'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

// =====================================================
// TYPES
// =====================================================

export interface CreateOrderParams {
    vendorId: string;
    eventDate: Date;
    notes?: string;
    title?: string;
}

export interface Order {
    id: string;
    vendor_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    title: string;
    package_type: string | null;
    event_date: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    amount: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// =====================================================
// HOOK: useCreateOrder
// =====================================================

/**
 * Creates a booking order for a vendor
 * This is the first step in the booking workflow
 * Vendor must accept the order before conversation can begin
 * 
 * @returns Function to create order and loading/error states
 */
export function useCreateOrder() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const createOrder = useCallback(
        async (params: CreateOrderParams): Promise<{ success: boolean; orderId?: string; error?: string }> => {
            if (!user) {
                return { success: false, error: 'User must be authenticated' };
            }

            const { vendorId, eventDate, notes, title } = params;

            try {
                setLoading(true);
                setError(null);

                // Get user profile for customer name
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                // Get user email from auth
                const customerName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
                const customerEmail = user.email || null;

                // Create the order
                // Use local date components to avoid timezone conversion issues
                const year = eventDate.getFullYear();
                const month = String(eventDate.getMonth() + 1).padStart(2, '0');
                const day = String(eventDate.getDate()).padStart(2, '0');
                const eventDateString = `${year}-${month}-${day}`;

                const { data: order, error: createError } = await supabase
                    .from('orders')
                    .insert({
                        vendor_id: vendorId,
                        customer_id: user.id,
                        customer_name: customerName,
                        customer_email: customerEmail,
                        title: title || 'Event Booking',
                        event_date: eventDateString, // Use local date string
                        status: 'pending',
                        notes: notes || null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select('id')
                    .single();

                if (createError) {
                    console.error('Error creating order:', createError);
                    throw createError;
                }

                return { success: true, orderId: order.id };
            } catch (err: any) {
                console.error('Error creating order:', err);
                const errorMsg = err.message || 'Failed to create booking';
                setError(errorMsg);
                return { success: false, error: errorMsg };
            } finally {
                setLoading(false);
            }
        },
        [user, supabase]
    );

    return { createOrder, loading, error };
}

// =====================================================
// HOOK: useUserOrders
// =====================================================

/**
 * Fetches all orders for the current customer
 * 
 * @returns Object with orders, loading state, and error
 */
export function useUserOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchOrders = useCallback(async () => {
        if (!user) {
            setOrders([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setOrders(data || []);
        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    return { orders, loading, error, refetch: fetchOrders };
}

// =====================================================
// HOOK: useOrder
// =====================================================

/**
 * Fetches a single order by ID with real-time updates
 * 
 * @param orderId - The order ID
 * @returns Object with order, loading state, and error
 */
export function useOrder(orderId: string | null) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchOrder = useCallback(async () => {
        if (!orderId) {
            setOrder(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (fetchError) throw fetchError;

            setOrder(data);
        } catch (err: any) {
            console.error('Error fetching order:', err);
            setError(err.message || 'Failed to load order');
        } finally {
            setLoading(false);
        }
    }, [orderId, supabase]);

    return { order, loading, error, refetch: fetchOrder };
}
