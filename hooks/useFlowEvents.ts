import { createClient } from '@/lib/supabase/client';
import { CreateEventBundlePayload, PlannedEvent, EventInquiryItem } from '@/types/events';
import { useState } from 'react';

export function useFlowEvents() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // Call RPC: check_vendor_availability
    const checkAvailability = async (vendorId: string, date: Date): Promise<boolean> => {
        try {
            // Format date as YYYY-MM-DD
            const dateString = date.toISOString().split('T')[0];

            const { data, error } = await supabase.rpc('check_vendor_availability', {
                target_vendor_id: vendorId,
                target_date: dateString,
            });

            if (error) throw error;
            return !!data;
        } catch (err: any) {
            console.error('Availability check failed:', err);
            return false; // Fail safe
        }
    };

    // Call RPC: create_event_bundle
    const createEventBundle = async (payload: CreateEventBundlePayload): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.rpc('create_event_bundle', {
                p_title: payload.title,
                p_event_date: payload.event_date,
                p_items: payload.items,
            });

            if (error) throw error;

            return data as string; // Returns the new event UUID
        } catch (err: any) {
            console.error('Create bundle failed:', err);
            setError(err.message || 'Failed to create event bundle');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Call RPC: replace_vendor_in_bundle (Hot-Swap)
    const replaceVendorInBundle = async (itemId: string, newVendorId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.rpc('replace_vendor_in_bundle', {
                p_item_id: itemId,
                p_new_vendor_id: newVendorId,
            });

            if (error) throw error;
            return !!data;
        } catch (err: any) {
            console.error('Replace vendor failed:', err);
            setError(err.message || 'Failed to replace vendor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fetch all planned events for current user
    const fetchMyEvents = async (): Promise<PlannedEvent[]> => {
        try {
            const { data, error } = await supabase
                .from('planned_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err: any) {
            console.error('Fetch events failed:', err);
            return [];
        }
    };

    // Fetch event details with inquiry items
    const fetchEventWithItems = async (eventId: string): Promise<{
        event: PlannedEvent | null;
        items: EventInquiryItem[];
    }> => {
        try {
            const [eventResult, itemsResult] = await Promise.all([
                supabase.from('planned_events').select('*').eq('id', eventId).single(),
                supabase.from('event_inquiry_items').select('*').eq('event_id', eventId),
            ]);

            return {
                event: eventResult.data,
                items: itemsResult.data || [],
            };
        } catch (err: any) {
            console.error('Fetch event details failed:', err);
            return { event: null, items: [] };
        }
    };

    return {
        checkAvailability,
        createEventBundle,
        replaceVendorInBundle,
        fetchMyEvents,
        fetchEventWithItems,
        loading,
        error,
    };
}
