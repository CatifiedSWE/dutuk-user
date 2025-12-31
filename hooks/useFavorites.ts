'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUser } from '@/lib/auth/customer-auth';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        const supabase = createClient();
        const user = await getCurrentUser();
        
        if (!user) {
          setFavorites([]);
          return;
        }
        
        const { data, error: fetchError } = await supabase
          .from('favorites')
          .select('vendor_id, service_id')
          .eq('user_id', user.id);
        
        if (fetchError) throw fetchError;
        
        // Extract IDs (both vendor_id and service_id)
        const ids = data?.map(fav => fav.vendor_id || fav.service_id).filter(Boolean) || [];
        setFavorites(ids);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFavorites();
  }, []);
  
  async function toggleFavorite(itemId: string, type: 'vendor' | 'service') {
    try {
      const supabase = createClient();
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error('You must be logged in to add favorites');
      }
      
      const isFavorite = favorites.includes(itemId);
      
      if (isFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq(type === 'vendor' ? 'vendor_id' : 'service_id', itemId);
        
        if (deleteError) throw deleteError;
        
        setFavorites(prev => prev.filter(id => id !== itemId));
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            [type === 'vendor' ? 'vendor_id' : 'service_id']: itemId
          });
        
        if (insertError) throw insertError;
        
        setFavorites(prev => [...prev, itemId]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error toggling favorite:', err);
      throw err;
    }
  }
  
  return { favorites, loading, error, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) };
}
