-- =====================================================
-- DUTUK CHAT SYSTEM - CONVERSATIONS & MESSAGES TABLES
-- =====================================================
-- Execute this in Supabase SQL Editor
-- This creates the messaging infrastructure for customer-vendor communication
-- Version: 1.0
-- Created: January 2025

-- =====================================================
-- 1. CONVERSATIONS TABLE
-- =====================================================
-- Stores metadata for chat conversations between customers and vendors
-- Tracks Terms & Conditions acceptance and payment status for contact sharing

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Terms & Conditions Tracking
    terms_accepted_by_customer BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment Gate for Contact Info Sharing
    -- When true, users can share contact information
    payment_completed BOOLEAN DEFAULT false,
    payment_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Link to booking/event if conversation is related to a booking
    booking_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    
    -- Conversation Metadata
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_preview TEXT, -- Preview of last message for sidebar
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one conversation per customer-vendor pair
    UNIQUE(customer_id, vendor_id)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON public.conversations(customer_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor ON public.conversations(vendor_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_booking ON public.conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);

COMMENT ON TABLE public.conversations IS 'Chat conversations between customers and vendors with T&C and payment tracking';
COMMENT ON COLUMN public.conversations.terms_accepted_by_customer IS 'True when customer accepts T&C before first message';
COMMENT ON COLUMN public.conversations.payment_completed IS 'True after payment is made - enables contact info sharing';
COMMENT ON COLUMN public.conversations.booking_id IS 'Links conversation to a specific booking/event if applicable';
COMMENT ON COLUMN public.conversations.last_message_preview IS 'Preview text of most recent message for conversation list';

-- =====================================================
-- 2. MESSAGES TABLE
-- =====================================================
-- Stores individual messages within conversations

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relationships
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Message Content
    message_text TEXT NOT NULL,
    
    -- File Attachments
    has_attachment BOOLEAN DEFAULT false,
    attachment_url TEXT, -- Supabase Storage URL
    attachment_name TEXT, -- Original filename
    attachment_size TEXT, -- Human-readable size (e.g., "2.4 MB")
    attachment_type TEXT, -- MIME type or file extension
    
    -- Read Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validation: Ensure message has either text or attachment
    CHECK (
        (message_text IS NOT NULL AND message_text != '') 
        OR 
        (has_attachment = true AND attachment_url IS NOT NULL)
    )
);

-- Indexes for fast message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(receiver_id, is_read) WHERE is_read = false;

COMMENT ON TABLE public.messages IS 'Individual messages within conversations with attachment support';
COMMENT ON COLUMN public.messages.message_text IS 'Message content - required unless has_attachment is true';
COMMENT ON COLUMN public.messages.has_attachment IS 'True if message includes a file attachment';
COMMENT ON COLUMN public.messages.is_read IS 'True when receiver has viewed the message';

-- =====================================================
-- 3. TRIGGER: Update conversation on new message
-- =====================================================
-- Automatically updates last_message_at and last_message_preview when new message is sent

CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET 
        last_message_at = NEW.created_at,
        last_message_preview = CASE 
            WHEN NEW.has_attachment = true THEN '📎 Sent an attachment'
            ELSE LEFT(NEW.message_text, 100)
        END,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_on_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_on_message();

COMMENT ON FUNCTION update_conversation_on_message() IS 'Updates conversation metadata when new message is sent';

-- =====================================================
-- 4. TRIGGER: Update conversations updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_count(user_id_param UUID)
RETURNS TABLE (
    conversation_id UUID,
    unread_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.conversation_id,
        COUNT(*) as unread_count
    FROM public.messages m
    WHERE 
        m.receiver_id = user_id_param
        AND m.is_read = false
    GROUP BY m.conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_unread_count IS 'Returns unread message counts per conversation for a user';

-- Function to mark all messages in a conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
    conversation_id_param UUID,
    user_id_param UUID
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.messages
    SET 
        is_read = true,
        read_at = NOW()
    WHERE 
        conversation_id = conversation_id_param
        AND receiver_id = user_id_param
        AND is_read = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_conversation_as_read IS 'Marks all unread messages in a conversation as read for a user';

-- Function to check if user is participant in conversation
CREATE OR REPLACE FUNCTION is_conversation_participant(
    conversation_id_param UUID,
    user_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    is_participant BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM public.conversations 
        WHERE 
            id = conversation_id_param
            AND (customer_id = user_id_param OR vendor_id = user_id_param)
    ) INTO is_participant;
    
    RETURN is_participant;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_conversation_participant IS 'Checks if user is a participant in the conversation';

-- =====================================================
-- 6. VIEWS FOR EASIER QUERYING
-- =====================================================

-- View: Conversations with participant details
CREATE OR REPLACE VIEW conversations_with_users AS
SELECT 
    c.id,
    c.customer_id,
    c.vendor_id,
    c.terms_accepted_by_customer,
    c.terms_accepted_at,
    c.payment_completed,
    c.payment_completed_at,
    c.booking_id,
    c.last_message_at,
    c.last_message_preview,
    c.created_at,
    c.updated_at,
    
    -- Customer details
    cp.full_name as customer_name,
    cp.avatar_url as customer_avatar,
    cu.email as customer_email,
    
    -- Vendor details (from companies table)
    comp.company as vendor_name,
    comp.logo_url as vendor_avatar,
    comp.company as vendor_company,
    vu.email as vendor_email
    
FROM public.conversations c
LEFT JOIN public.customer_profiles cp ON c.customer_id = cp.user_id
LEFT JOIN auth.users cu ON c.customer_id = cu.id
LEFT JOIN public.companies comp ON c.vendor_id = comp.user_id
LEFT JOIN auth.users vu ON c.vendor_id = vu.id;

COMMENT ON VIEW conversations_with_users IS 'Conversations with full participant details for easy querying';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Chat tables created successfully!';
    RAISE NOTICE 'Created: conversations, messages tables';
    RAISE NOTICE 'Created: 3 triggers, 3 helper functions, 1 view';
    RAISE NOTICE 'Next step: Execute 10_create_rls_for_chat_tables.sql';
END $$;
