-- =====================================================
-- DUTUK CHAT SYSTEM - ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Execute this in Supabase SQL Editor AFTER 09_create_chat_tables.sql
-- Secures conversations and messages tables
-- Version: 1.0
-- Created: January 2025

-- =====================================================
-- 1. ENABLE RLS ON TABLES
-- =====================================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CONVERSATIONS TABLE POLICIES
-- =====================================================

-- Policy: Users can view conversations they are part of (as customer or vendor)
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations"
    ON public.conversations
    FOR SELECT
    USING (
        auth.uid() = customer_id 
        OR 
        auth.uid() = vendor_id
    );

-- Policy: Authenticated users can create conversations
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations"
    ON public.conversations
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            auth.uid() = customer_id 
            OR 
            auth.uid() = vendor_id
        )
    );

-- Policy: Users can update conversations they are part of
-- (For updating terms_accepted, payment_completed, etc.)
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
CREATE POLICY "Users can update their conversations"
    ON public.conversations
    FOR UPDATE
    USING (
        auth.uid() = customer_id 
        OR 
        auth.uid() = vendor_id
    )
    WITH CHECK (
        auth.uid() = customer_id 
        OR 
        auth.uid() = vendor_id
    );

-- Policy: Users cannot delete conversations (preserve message history)
-- Admin/platform can delete via service role if needed
DROP POLICY IF EXISTS "Users cannot delete conversations" ON public.conversations;
CREATE POLICY "Users cannot delete conversations"
    ON public.conversations
    FOR DELETE
    USING (false);

COMMENT ON POLICY "Users can view their own conversations" ON public.conversations 
    IS 'Users can only see conversations where they are customer or vendor';
COMMENT ON POLICY "Authenticated users can create conversations" ON public.conversations 
    IS 'Authenticated users can create conversations if they are a participant';
COMMENT ON POLICY "Users can update their conversations" ON public.conversations 
    IS 'Participants can update conversation metadata (T&C acceptance, payment status)';
COMMENT ON POLICY "Users cannot delete conversations" ON public.conversations 
    IS 'Preserve conversation history - only service role can delete';

-- =====================================================
-- 3. MESSAGES TABLE POLICIES
-- =====================================================

-- Policy: Users can view messages in conversations they are part of
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM public.conversations c
            WHERE 
                c.id = conversation_id
                AND (c.customer_id = auth.uid() OR c.vendor_id = auth.uid())
        )
    );

-- Policy: Users can insert messages if they are the sender and part of the conversation
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
CREATE POLICY "Users can send messages in their conversations"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND
        EXISTS (
            SELECT 1 
            FROM public.conversations c
            WHERE 
                c.id = conversation_id
                AND (c.customer_id = auth.uid() OR c.vendor_id = auth.uid())
        )
    );

-- Policy: Users can update messages they received (to mark as read)
DROP POLICY IF EXISTS "Users can mark received messages as read" ON public.messages;
CREATE POLICY "Users can mark received messages as read"
    ON public.messages
    FOR UPDATE
    USING (auth.uid() = receiver_id)
    WITH CHECK (
        auth.uid() = receiver_id
        AND is_read = true -- Can only update to mark as read
    );

-- Policy: Users cannot delete messages (preserve message history)
-- Admin/platform can delete via service role if needed for moderation
DROP POLICY IF EXISTS "Users cannot delete messages" ON public.messages;
CREATE POLICY "Users cannot delete messages"
    ON public.messages
    FOR DELETE
    USING (false);

COMMENT ON POLICY "Users can view messages in their conversations" ON public.messages 
    IS 'Users can see messages only in conversations they participate in';
COMMENT ON POLICY "Users can send messages in their conversations" ON public.messages 
    IS 'Users can send messages as sender in their conversations';
COMMENT ON POLICY "Users can mark received messages as read" ON public.messages 
    IS 'Recipients can mark messages as read';
COMMENT ON POLICY "Users cannot delete messages" ON public.messages 
    IS 'Preserve message history - only service role can delete for moderation';

-- =====================================================
-- 4. GRANT PERMISSIONS TO AUTHENTICATED USERS
-- =====================================================

-- Grant basic permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;

-- Grant access to helper functions
GRANT EXECUTE ON FUNCTION get_unread_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_as_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_conversation_participant(UUID, UUID) TO authenticated;

-- Grant access to view
GRANT SELECT ON conversations_with_users TO authenticated;

-- =====================================================
-- 5. SECURITY TESTS
-- =====================================================

-- Test function to verify RLS is working
-- Run this with different authenticated users to test policies
CREATE OR REPLACE FUNCTION test_chat_rls()
RETURNS TABLE (
    test_name TEXT,
    result TEXT
) AS $$
DECLARE
    current_user_id UUID;
BEGIN
    SELECT auth.uid() INTO current_user_id;
    
    RETURN QUERY
    SELECT 
        'Current User ID'::TEXT,
        COALESCE(current_user_id::TEXT, 'Not authenticated')::TEXT;
    
    RETURN QUERY
    SELECT 
        'Can view conversations'::TEXT,
        (SELECT COUNT(*)::TEXT FROM public.conversations)::TEXT;
    
    RETURN QUERY
    SELECT 
        'Can view messages'::TEXT,
        (SELECT COUNT(*)::TEXT FROM public.messages)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION test_chat_rls() IS 'Test function to verify RLS policies are working correctly';

-- =====================================================
-- 6. REALTIME PUBLICATION
-- =====================================================

-- Enable Realtime for conversations and messages tables
-- This allows Supabase Realtime subscriptions to work

ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Note: If you get an error "publication does not exist", run:
-- CREATE PUBLICATION supabase_realtime;
-- Then run the ALTER commands above

-- =====================================================
-- 7. ADDITIONAL SECURITY NOTES
-- =====================================================

-- IMPORTANT SECURITY NOTES:
-- 1. Contact Info Filtering: Should also be validated server-side using triggers
--    (Will implement in Phase 2 if needed)
-- 
-- 2. Rate Limiting: Consider adding rate limiting for message sending
--    (Can be implemented via Edge Functions or application layer)
--
-- 3. Spam Prevention: Monitor for spam patterns and implement reporting
--    (Future enhancement)
--
-- 4. File Upload Security: Validate file types and sizes in storage policies
--    (Configure in Supabase Storage bucket policies)

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies applied successfully!';
    RAISE NOTICE 'Secured tables: conversations, messages';
    RAISE NOTICE 'Created policies: 8 total (4 per table)';
    RAISE NOTICE 'Enabled Realtime publication for live updates';
    RAISE NOTICE 'Next step: Test policies with authenticated users';
    RAISE NOTICE 'Then: Proceed to Phase 2 implementation';
END $$;
