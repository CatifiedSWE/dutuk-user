-- Dutuk Backend - Enable RLS for Events Table (Public Read Access)
-- Execute this in Supabase SQL Editor
-- This allows public users to read events for the explore/events page

-- =====================================================
-- ENABLE RLS ON EVENTS TABLE
-- =====================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE PUBLIC READ POLICY FOR EVENTS
-- =====================================================

-- Allow public/anonymous users to read all events (for customer browsing)
CREATE POLICY "Public can read events"
    ON public.events
    FOR SELECT
    USING (true);  -- Allow reading all events regardless of status

-- Alternative: If you want to only show upcoming/ongoing events to public:
-- CREATE POLICY "Public can read active events"
--     ON public.events
--     FOR SELECT
--     USING (status IN ('upcoming', 'ongoing'));

-- Vendors can read their own events (all statuses)
CREATE POLICY "Vendors can read own events"
    ON public.events
    FOR SELECT
    USING (vendor_id = auth.uid());

-- Vendors can create events
CREATE POLICY "Vendors can create events"
    ON public.events
    FOR INSERT
    WITH CHECK (vendor_id = auth.uid());

-- Vendors can update their own events
CREATE POLICY "Vendors can update own events"
    ON public.events
    FOR UPDATE
    USING (vendor_id = auth.uid());

-- Vendors can delete their own events
CREATE POLICY "Vendors can delete own events"
    ON public.events
    FOR DELETE
    USING (vendor_id = auth.uid());

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON public.events TO anon;         -- Allow anonymous browsing
GRANT SELECT ON public.events TO authenticated; -- Allow authenticated users
GRANT ALL ON public.events TO authenticated;    -- Full access for authenticated vendors

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Events table RLS policies created successfully!';
    RAISE NOTICE 'Public users can now browse events on the explore page.';
END $$;
