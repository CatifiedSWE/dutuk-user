'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  profile_image_url: string | null;
  created_at: string;
}

export function useCustomerProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!isAuthenticated || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching customer profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, isAuthenticated]);

  return { profile, loading, error };
}
