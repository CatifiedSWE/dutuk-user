'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { detectContactInfo } from '@/lib/utils/contactInfoFilter';

// =====================================================
// TYPES
// =====================================================

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  has_attachment: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: string | null;
  attachment_type: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface SendMessageParams {
  conversationId: string;
  receiverId: string;
  text: string;
  attachment?: {
    url: string;
    name: string;
    size: string;
    type: string;
  };
}

// =====================================================
// HOOK: useMessages
// =====================================================

/**
 * Fetches messages for a conversation with real-time updates
 * 
 * @param conversationId - The conversation ID
 * @param paymentCompleted - Whether payment has been completed (for contact filter)
 * @returns Object with messages, loading state, error, and send function
 */
export function useMessages(conversationId: string | null, paymentCompleted: boolean = false) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data || []);

      // Mark messages as read
      if (user && data && data.length > 0) {
        const unreadMessages = data.filter(
          (msg) => msg.receiver_id === user.id && !msg.is_read
        );

        if (unreadMessages.length > 0) {
          await supabase.rpc('mark_conversation_as_read', {
            conversation_id_param: conversationId,
            user_id_param: user.id,
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, user, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);

          // Mark as read if we're the receiver
          if (user && newMessage.receiver_id === user.id) {
            supabase.rpc('mark_conversation_as_read', {
              conversation_id_param: conversationId,
              user_id_param: user.id,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, supabase]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  };
}

// =====================================================
// HOOK: useSendMessage
// =====================================================

/**
 * Hook for sending messages with contact info validation
 * 
 * @returns Function to send messages and loading/error states
 */
export function useSendMessage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const sendMessage = useCallback(
    async (
      params: SendMessageParams,
      paymentCompleted: boolean = false
    ): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: 'User must be authenticated' };
      }

      try {
        setLoading(true);
        setError(null);

        // Validate message text for contact information
        const contactDetection = detectContactInfo(params.text, paymentCompleted);
        
        if (contactDetection.hasContactInfo) {
          setError(contactDetection.message);
          return { 
            success: false, 
            error: contactDetection.message 
          };
        }

        // Prepare message data
        const messageData: any = {
          conversation_id: params.conversationId,
          sender_id: user.id,
          receiver_id: params.receiverId,
          message_text: params.text,
          has_attachment: !!params.attachment,
        };

        if (params.attachment) {
          messageData.attachment_url = params.attachment.url;
          messageData.attachment_name = params.attachment.name;
          messageData.attachment_size = params.attachment.size;
          messageData.attachment_type = params.attachment.type;
        }

        // Insert message
        const { error: insertError } = await supabase
          .from('messages')
          .insert(messageData);

        if (insertError) throw insertError;

        return { success: true };
      } catch (err: any) {
        console.error('Error sending message:', err);
        const errorMessage = err.message || 'Failed to send message';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [user, supabase]
  );

  return { sendMessage, loading, error };
}

// =====================================================
// HOOK: useMarkAsRead
// =====================================================

/**
 * Marks all messages in a conversation as read
 * 
 * @returns Function to mark messages as read
 */
export function useMarkAsRead() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        await supabase.rpc('mark_conversation_as_read', {
          conversation_id_param: conversationId,
          user_id_param: user.id,
        });
      } catch (err: any) {
        console.error('Error marking messages as read:', err);
        setError(err.message || 'Failed to mark messages as read');
      } finally {
        setLoading(false);
      }
    },
    [user, supabase]
  );

  return { markAsRead, loading, error };
}
