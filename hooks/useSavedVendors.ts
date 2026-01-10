'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/customer-auth';

export interface SavedVendor {
    id: string;
    vendor_id: string;
    created_at: string;
    // Joined vendor data
    vendor?: {
        company: string;
        logo_url: string | null;
        description: string | null;
        address: string | null;
    };
}

/**
 * Hook to manage saved/favorite vendors
 */
export function useSavedVendors() {
    const [savedVendors, setSavedVendors] = useState<SavedVendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedVendors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const supabase = createClient();
            const user = await getCurrentUser();

            if (!user) {
                setSavedVendors([]);
                setLoading(false);
                return;
            }

            // Fetch saved vendors with company data
            // Note: We need to query companies separately since vendor_id references auth.users
            const { data, error: fetchError } = await supabase
                .from('saved_vendors')
                .select('id, vendor_id, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('Error fetching saved vendors:', fetchError);
                setError(fetchError.message);
                setLoading(false);
                return;
            }

            // Transform data to include vendor info
            const vendors: SavedVendor[] = (data || []).map((item: any) => ({
                id: item.id,
                vendor_id: item.vendor_id,
                created_at: item.created_at,
                vendor: item.companies ? {
                    company: item.companies.company,
                    logo_url: item.companies.logo_url,
                    description: item.companies.description,
                    address: item.companies.address,
                } : undefined,
            }));

            setSavedVendors(vendors);
        } catch (err: any) {
            console.error('Error fetching saved vendors:', err);
            setError(err.message || 'Failed to load saved vendors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSavedVendors();
    }, [fetchSavedVendors]);

    return {
        savedVendors,
        loading,
        error,
        refetch: fetchSavedVendors,
    };
}

/**
 * Hook to check if a specific vendor is saved and toggle save state
 */
export function useVendorSaveState(vendorId: string | undefined) {
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if vendor is saved
    const checkSaveState = useCallback(async () => {
        if (!vendorId) {
            setIsSaved(false);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const supabase = createClient();
            const user = await getCurrentUser();

            if (!user) {
                setIsSaved(false);
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('saved_vendors')
                .select('id')
                .eq('user_id', user.id)
                .eq('vendor_id', vendorId)
                .maybeSingle();

            if (fetchError) {
                console.error('Error checking save state:', fetchError);
                setError(fetchError.message);
            } else {
                setIsSaved(!!data);
            }
        } catch (err: any) {
            console.error('Error checking save state:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        checkSaveState();
    }, [checkSaveState]);

    // Toggle save state
    const toggleSave = useCallback(async (): Promise<boolean> => {
        if (!vendorId) return false;

        try {
            setToggling(true);
            setError(null);

            const supabase = createClient();
            const user = await getCurrentUser();

            if (!user) {
                throw new Error('You must be logged in to save vendors');
            }

            if (isSaved) {
                // Unsave vendor
                const { error: deleteError } = await supabase
                    .from('saved_vendors')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('vendor_id', vendorId);

                if (deleteError) throw deleteError;
                setIsSaved(false);
            } else {
                // Save vendor
                const { error: insertError } = await supabase
                    .from('saved_vendors')
                    .insert({
                        user_id: user.id,
                        vendor_id: vendorId,
                    });

                if (insertError) throw insertError;
                setIsSaved(true);
            }

            return true;
        } catch (err: any) {
            console.error('Error toggling save state:', err);
            setError(err.message || 'Failed to update save state');
            return false;
        } finally {
            setToggling(false);
        }
    }, [vendorId, isSaved]);

    return {
        isSaved,
        loading,
        toggling,
        error,
        toggleSave,
        refetch: checkSaveState,
    };
}
