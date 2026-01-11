'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

// =====================================================
// TYPES
// =====================================================

export interface Conversation {
  id: string;
  customer_id: string;
  vendor_id: string;
  terms_accepted_by_customer: boolean;
  terms_accepted_at: string | null;
  payment_completed: boolean;
  payment_completed_at: string | null;
  booking_id: string | null;
  last_message_at: string;
  last_message_preview: string | null;
  created_at: string;
  updated_at: string;

  // Joined data from view
  customer_name: string | null;
  customer_avatar: string | null;
  customer_email: string | null;
  vendor_name: string | null;
  vendor_avatar: string | null;
  vendor_company: string | null;
  vendor_email: string | null;
}

export interface ConversationWithUnread extends Conversation {
  unread_count: number;
}

// =====================================================
// HOOK: useConversations
// =====================================================

/**
 * Fetches all conversations for the current user
 * Includes real-time updates via Supabase Realtime
 * 
 * @returns Object with conversations, loading state, error, and unread count
 */
export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithUnread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch conversations with user details
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations_with_users')
        .select('*')
        .or(`customer_id.eq.${user.id},vendor_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Fetch unread counts
      const { data: unreadData, error: unreadError } = await supabase
        .rpc('get_unread_count', { user_id_param: user.id });

      if (unreadError) {
        console.warn('Error fetching unread counts:', unreadError);
      }

      // Merge unread counts with conversations
      const conversationsWithUnread: ConversationWithUnread[] = (conversationsData || []).map((conv) => {
        const unreadInfo = unreadData?.find((u: any) => u.conversation_id === conv.id);
        return {
          ...conv,
          unread_count: unreadInfo?.unread_count || 0,
        };
      });

      setConversations(conversationsWithUnread);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription for conversation and message updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to new conversations where user is involved
    const conversationsChannel = supabase
      .channel('user-conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          // Check if user is part of this conversation
          const conv = payload.new as any;
          if (conv.customer_id === user.id || conv.vendor_id === user.id) {
            fetchConversations();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          // Check if user is part of this conversation
          const conv = payload.new as any;
          if (conv.customer_id === user.id || conv.vendor_id === user.id) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    // Subscribe to new messages - this updates last_message_at and triggers list refresh
    const messagesChannel = supabase
      .channel('user-messages-list')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Refetch conversations to update the list ordering and unread counts
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, supabase, fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}

// =====================================================
// HOOK: useConversation
// =====================================================

/**
 * Fetches a single conversation by ID
 * 
 * @param conversationId - The conversation ID
 * @returns Object with conversation, loading state, and error
 */
export function useConversation(conversationId: string | null) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      setLoading(false);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('conversations_with_users')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (fetchError) throw fetchError;

        setConversation(data);
      } catch (err: any) {
        console.error('Error fetching conversation:', err);
        setError(err.message || 'Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, supabase]);

  return { conversation, loading, error };
}

// =====================================================
// HOOK: useCreateConversation
// =====================================================

/**
 * Creates a new conversation or returns existing one
 * 
 * @returns Function to create conversation
 */
export function useCreateConversation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const createConversation = useCallback(
    async (vendorId: string) => {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      try {
        setLoading(true);
        setError(null);

        // Check if conversation already exists
        const { data: existingConv, error: checkError } = await supabase
          .from('conversations')
          .select('id')
          .eq('customer_id', user.id)
          .eq('vendor_id', vendorId)
          .single();

        if (existingConv) {
          return existingConv.id;
        }

        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            customer_id: user.id,
            vendor_id: vendorId,
            terms_accepted_by_customer: false,
          })
          .select('id')
          .single();

        if (createError) throw createError;

        return newConv.id;
      } catch (err: any) {
        console.error('Error creating conversation:', err);
        setError(err.message || 'Failed to create conversation');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, supabase]
  );

  return { createConversation, loading, error };
}

// =====================================================
// HOOK: useAcceptTerms
// =====================================================

/**
 * Accepts terms and conditions for a conversation
 * 
 * @returns Function to accept terms
 */
export function useAcceptTerms() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const acceptTerms = useCallback(
    async (conversationId: string) => {
      try {
        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            terms_accepted_by_customer: true,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('id', conversationId);

        if (updateError) throw updateError;

        return true;
      } catch (err: any) {
        console.error('Error accepting terms:', err);
        setError(err.message || 'Failed to accept terms');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return { acceptTerms, loading, error };
}
