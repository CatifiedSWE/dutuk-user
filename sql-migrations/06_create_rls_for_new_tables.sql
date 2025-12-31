-- Dutuk Backend - RLS Policies for New Tables
-- Execute this AFTER 05_extend_schema_for_users.sql

-- =====================================================
-- ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VENDOR_SERVICES POLICIES
-- =====================================================

-- Public can read active services (for customer browsing)
CREATE POLICY "Public can read active services"
    ON public.vendor_services
    FOR SELECT
    USING (is_active = true);

-- Vendors can read their own services (active or inactive)
CREATE POLICY "Vendors can read own services"
    ON public.vendor_services
    FOR SELECT
    USING (vendor_id = auth.uid());

-- Vendors can create their own services
CREATE POLICY "Vendors can create own services"
    ON public.vendor_services
    FOR INSERT
    WITH CHECK (vendor_id = auth.uid());

-- Vendors can update their own services
CREATE POLICY "Vendors can update own services"
    ON public.vendor_services
    FOR UPDATE
    USING (vendor_id = auth.uid());

-- Vendors can delete their own services
CREATE POLICY "Vendors can delete own services"
    ON public.vendor_services
    FOR DELETE
    USING (vendor_id = auth.uid());

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Everyone can read active categories (public data)
CREATE POLICY "Public can read active categories"
    ON public.categories
    FOR SELECT
    USING (is_active = true);

-- Only admins can modify categories (future implementation)
-- For now, manage via SQL editor

-- =====================================================
-- CUSTOMER_PROFILES POLICIES
-- =====================================================

-- Users can read their own customer profile
CREATE POLICY "Users can read own customer profile"
    ON public.customer_profiles
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can create their own customer profile
CREATE POLICY "Users can create own customer profile"
    ON public.customer_profiles
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own customer profile
CREATE POLICY "Users can update own customer profile"
    ON public.customer_profiles
    FOR UPDATE
    USING (user_id = auth.uid());

-- Users can delete their own customer profile
CREATE POLICY "Users can delete own customer profile"
    ON public.customer_profiles
    FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- FAVORITES POLICIES
-- =====================================================

-- Users can read their own favorites
CREATE POLICY "Users can read own favorites"
    ON public.favorites
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can create their own favorites
CREATE POLICY "Users can create own favorites"
    ON public.favorites
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
    ON public.favorites
    FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
    ON public.notifications
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON public.notifications
    FOR UPDATE
    USING (user_id = auth.uid());

-- System can insert notifications for any user
-- (via service_role or RPC functions)
CREATE POLICY "System can insert notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
    ON public.notifications
    FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON public.vendor_services TO authenticated;
GRANT SELECT ON public.vendor_services TO anon; -- Allow anonymous browsing

GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon; -- Allow anonymous browsing

GRANT ALL ON public.customer_profiles TO authenticated;
GRANT ALL ON public.favorites TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Function to check if user is a vendor
CREATE OR REPLACE FUNCTION is_vendor(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE user_profiles.user_id = is_vendor.user_id;
    
    RETURN user_role = 'vendor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a customer
CREATE OR REPLACE FUNCTION is_customer(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE user_profiles.user_id = is_customer.user_id;
    
    RETURN user_role = 'customer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's company name (for vendors)
CREATE OR REPLACE FUNCTION get_user_company_name(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    company_name TEXT;
BEGIN
    SELECT company INTO company_name
    FROM public.companies
    WHERE companies.user_id = get_user_company_name.user_id;
    
    RETURN company_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RPC FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to toggle favorite
CREATE OR REPLACE FUNCTION toggle_favorite(
    target_vendor_id UUID DEFAULT NULL,
    target_service_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    existing_favorite_id UUID;
    result JSONB;
BEGIN
    -- Check if favorite already exists
    IF target_vendor_id IS NOT NULL THEN
        SELECT id INTO existing_favorite_id
        FROM public.favorites
        WHERE user_id = auth.uid() AND vendor_id = target_vendor_id;
    ELSIF target_service_id IS NOT NULL THEN
        SELECT id INTO existing_favorite_id
        FROM public.favorites
        WHERE user_id = auth.uid() AND service_id = target_service_id;
    ELSE
        RETURN jsonb_build_object('error', 'Must provide either vendor_id or service_id');
    END IF;
    
    -- If exists, delete it
    IF existing_favorite_id IS NOT NULL THEN
        DELETE FROM public.favorites WHERE id = existing_favorite_id;
        RETURN jsonb_build_object('action', 'removed', 'favorite_id', existing_favorite_id);
    ELSE
        -- If doesn't exist, create it
        INSERT INTO public.favorites (user_id, vendor_id, service_id)
        VALUES (auth.uid(), target_vendor_id, target_service_id)
        RETURNING id INTO existing_favorite_id;
        
        RETURN jsonb_build_object('action', 'added', 'favorite_id', existing_favorite_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true, read_at = NOW()
    WHERE id = notification_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for current user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.notifications
    SET is_read = true, read_at = NOW()
    WHERE user_id = auth.uid() AND is_read = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TEST RLS POLICIES (Run as different users to verify)
-- =====================================================

-- Test queries (uncomment to run manually):
/*
-- Test 1: Check if public can read active services
SET ROLE anon;
SELECT * FROM public.vendor_services WHERE is_active = true;
RESET ROLE;

-- Test 2: Check if vendor can only see their own services
SET ROLE authenticated;
SET request.jwt.claims.sub = '<vendor-user-id>';
SELECT * FROM public.vendor_services;
RESET ROLE;

-- Test 3: Check if customer can read their own profile
SET ROLE authenticated;
SET request.jwt.claims.sub = '<customer-user-id>';
SELECT * FROM public.customer_profiles WHERE user_id = '<customer-user-id>';
RESET ROLE;
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies created successfully!';
    RAISE NOTICE 'Protected tables: vendor_services, categories, customer_profiles, favorites, notifications';
    RAISE NOTICE 'Created helper functions: is_vendor(), is_customer(), toggle_favorite()';
    RAISE NOTICE 'Next step: Execute 07_seed_categories.sql';
END $$;
