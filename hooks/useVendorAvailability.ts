'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface VendorAvailability {
    date: string;
    status: 'available' | 'unavailable';
}

export interface BlockedDate {
    date: string;
    reason: 'unavailable' | 'booked';
}

// =====================================================
// HOOK: useVendorAvailability
// =====================================================

/**
 * Fetches vendor availability from the dates table
 * Also fetches dates with existing approved orders
 * Returns combined list of blocked dates
 * 
 * @param vendorId - The vendor's user ID
 * @returns Object with blocked dates, available dates, loading state, and error
 */
export function useVendorAvailability(vendorId: string | undefined) {
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchAvailability = useCallback(async () => {
        if (!vendorId) {
            setBlockedDates([]);
            setAvailableDates([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch vendor's availability settings from dates table
            const { data: datesData, error: datesError } = await supabase
                .from('dates')
                .select('date, status')
                .eq('user_id', vendorId);

            if (datesError) {
                console.error('Error fetching vendor dates:', datesError);
                throw datesError;
            }

            // Process dates data - only use vendor's explicit availability settings
            // Note: We don't block based on orders - vendors can accept multiple bookings per date
            const blocked: BlockedDate[] = [];
            const available: string[] = [];

            // Add unavailable dates from vendor settings
            (datesData || []).forEach((d) => {
                if (d.status === 'unavailable' || d.status === 'blocked') {
                    blocked.push({
                        date: d.date,
                        reason: 'unavailable',
                    });
                } else if (d.status === 'available') {
                    available.push(d.date);
                }
            });

            setBlockedDates(blocked);
            setAvailableDates(available);
        } catch (err: any) {
            console.error('Error fetching vendor availability:', err);
            setError(err.message || 'Failed to load availability');
        } finally {
            setLoading(false);
        }
    }, [vendorId, supabase]);

    // Fetch on mount and when vendorId changes
    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Helper function to check if a specific date is blocked
    const isDateBlocked = useCallback(
        (date: Date): boolean => {
            const dateString = date.toISOString().split('T')[0];
            return blockedDates.some(b => b.date === dateString);
        },
        [blockedDates]
    );

    // Helper function to get blocked dates as Date objects
    const getBlockedDateObjects = useCallback((): Date[] => {
        return blockedDates.map(b => new Date(b.date + 'T00:00:00'));
    }, [blockedDates]);

    // Helper to get the blocking reason for a date
    const getBlockReason = useCallback(
        (date: Date): 'unavailable' | 'booked' | null => {
            const dateString = date.toISOString().split('T')[0];
            const blocked = blockedDates.find(b => b.date === dateString);
            return blocked?.reason || null;
        },
        [blockedDates]
    );

    return {
        blockedDates,
        availableDates,
        loading,
        error,
        refetch: fetchAvailability,
        isDateBlocked,
        getBlockedDateObjects,
        getBlockReason,
    };
}

export default useVendorAvailability;
