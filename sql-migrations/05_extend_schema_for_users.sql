-- Dutuk Backend - Schema Extensions for User Website
-- Execute this in Supabase SQL Editor AFTER 01-04 scripts
-- This adds customer-facing features while maintaining vendor app compatibility

-- =====================================================
-- 1. VENDOR SERVICES TABLE (Public Service Catalog)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vendor_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    
    -- Service Details
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL, -- 'wedding', 'birthday', 'corporate', 'photography', 'catering', etc.
    description TEXT,
    short_description TEXT,
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'per_person', 'per_hour', 'per_day', 'custom')),
    currency TEXT DEFAULT 'USD',
    
    -- Availability
    is_active BOOLEAN DEFAULT true,
    max_bookings_per_day INTEGER DEFAULT 1,
    min_notice_days INTEGER DEFAULT 7, -- Minimum days notice required
    
    -- Media
    featured_image TEXT,
    gallery_images TEXT[], -- Array of image URLs
    
    -- SEO & Discovery
    tags TEXT[],
    category TEXT NOT NULL,
    subcategory TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast service discovery
CREATE INDEX IF NOT EXISTS idx_vendor_services_category ON public.vendor_services(category, is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor ON public.vendor_services(vendor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_services_type ON public.vendor_services(service_type, is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_services_search 
    ON public.vendor_services USING gin(to_tsvector('english', service_name || ' ' || COALESCE(description, '')));

COMMENT ON TABLE public.vendor_services IS 'Public catalog of vendor services/packages that customers can browse and book';

-- =====================================================
-- 2. CATEGORIES TABLE (Service Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT, -- Icon identifier (lucide-react icon name)
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL, -- For subcategories
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active, display_order);

COMMENT ON TABLE public.categories IS 'Event and service categories for organizing vendors';

-- =====================================================
-- 3. CUSTOMER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Basic Info
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Address
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'USA',
    
    -- Preferences
    preferred_categories TEXT[],
    budget_range TEXT CHECK (budget_range IN ('low', 'medium', 'high', 'luxury')),
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
    
    -- Stats
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_profiles_user ON public.customer_profiles(user_id);

COMMENT ON TABLE public.customer_profiles IS 'Extended profile information for customers (user website users)';

-- =====================================================
-- 4. FAVORITES TABLE (Customer Wishlist)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Can favorite either a vendor or a specific service
    vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.vendor_services(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure at least one is set
    CHECK (vendor_id IS NOT NULL OR service_id IS NOT NULL),
    
    -- Prevent duplicate favorites
    UNIQUE(user_id, vendor_id),
    UNIQUE(user_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vendor ON public.favorites(vendor_id);
CREATE INDEX IF NOT EXISTS idx_favorites_service ON public.favorites(service_id);

COMMENT ON TABLE public.favorites IS 'Customer wishlist/favorites for vendors and services';

-- =====================================================
-- 5. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Notification Details
    type TEXT NOT NULL, -- 'booking_request', 'booking_accepted', 'payment_received', 'order_created', 'review_received', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional metadata (ids, links, etc.)
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Priority
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type, user_id);

COMMENT ON TABLE public.notifications IS 'In-app notifications for both customers and vendors';

-- =====================================================
-- 6. EXTEND EXISTING COMPANIES TABLE
-- =====================================================

-- Add discovery and categorization columns
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subcategories TEXT[];
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS service_area TEXT; -- City/Region served
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS years_in_business INTEGER;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add search index for companies
CREATE INDEX IF NOT EXISTS idx_companies_category ON public.companies(category, is_active);
CREATE INDEX IF NOT EXISTS idx_companies_area ON public.companies(service_area, is_active);
CREATE INDEX IF NOT EXISTS idx_companies_search 
    ON public.companies USING gin(to_tsvector('english', company || ' ' || COALESCE(description, '')));

-- =====================================================
-- 7. EXTEND EXISTING REVIEWS TABLE
-- =====================================================

-- Add social proof features
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS verified_booking BOOLEAN DEFAULT false;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS response TEXT; -- Vendor response to review
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS response_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 8. CREATE UPDATED_AT TRIGGERS FOR NEW TABLES
-- =====================================================

-- Trigger for vendor_services
DROP TRIGGER IF EXISTS update_vendor_services_updated_at ON public.vendor_services;
CREATE TRIGGER update_vendor_services_updated_at
    BEFORE UPDATE ON public.vendor_services
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Trigger for categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Trigger for customer_profiles
DROP TRIGGER IF EXISTS update_customer_profiles_updated_at ON public.customer_profiles;
CREATE TRIGGER update_customer_profiles_updated_at
    BEFORE UPDATE ON public.customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- 9. UPDATE handle_new_user FUNCTION
-- =====================================================

-- Modify to default to 'customer' role (website signup)
-- Vendor app will explicitly set role to 'vendor'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile with default 'customer' role
    -- Vendor mobile app will update this to 'vendor' after signup
    INSERT INTO public.user_profiles (user_id, role)
    VALUES (NEW.id, 'customer')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. UTILITY FUNCTIONS
-- =====================================================

-- Function to search vendors by text
CREATE OR REPLACE FUNCTION search_vendors(search_query TEXT, category_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    company TEXT,
    description TEXT,
    category TEXT,
    service_area TEXT,
    avg_rating DECIMAL,
    total_reviews INTEGER,
    logo_url TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.user_id,
        c.company,
        c.description,
        c.category,
        c.service_area,
        c.avg_rating,
        c.total_reviews,
        c.logo_url,
        ts_rank(
            to_tsvector('english', c.company || ' ' || COALESCE(c.description, '')),
            plainto_tsquery('english', search_query)
        ) AS rank
    FROM public.companies c
    WHERE 
        c.is_active = true
        AND (
            category_filter IS NULL 
            OR c.category = category_filter
        )
        AND to_tsvector('english', c.company || ' ' || COALESCE(c.description, '')) @@ 
            plainto_tsquery('english', search_query)
    ORDER BY rank DESC, c.avg_rating DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Function to update company rating when review is added/updated
CREATE OR REPLACE FUNCTION update_company_rating()
RETURNS TRIGGER AS $$
DECLARE
    vendor_company_id UUID;
    new_avg_rating DECIMAL;
    new_total_reviews INTEGER;
BEGIN
    -- Get the company_id for this vendor
    SELECT id INTO vendor_company_id
    FROM public.companies
    WHERE user_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
    LIMIT 1;
    
    IF vendor_company_id IS NOT NULL THEN
        -- Calculate new average rating and total reviews
        SELECT 
            COALESCE(AVG(rating), 0),
            COUNT(*)
        INTO new_avg_rating, new_total_reviews
        FROM public.reviews
        WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id);
        
        -- Update company record
        UPDATE public.companies
        SET 
            avg_rating = new_avg_rating,
            total_reviews = new_total_reviews,
            updated_at = NOW()
        WHERE id = vendor_company_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update company rating
DROP TRIGGER IF EXISTS update_company_rating_on_review ON public.reviews;
CREATE TRIGGER update_company_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_company_rating();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON COLUMN public.companies.category IS 'Primary service category (e.g., Wedding Planning, Photography)';
COMMENT ON COLUMN public.companies.service_area IS 'Geographic area served (e.g., New York, California)';
COMMENT ON COLUMN public.companies.avg_rating IS 'Calculated average rating from reviews (auto-updated)';
COMMENT ON COLUMN public.companies.total_reviews IS 'Total number of reviews (auto-updated)';
COMMENT ON COLUMN public.reviews.helpful_count IS 'Number of users who marked this review as helpful';
COMMENT ON COLUMN public.reviews.verified_booking IS 'True if this review is from a verified booking';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Schema extension completed successfully!';
    RAISE NOTICE 'Created tables: vendor_services, categories, customer_profiles, favorites, notifications';
    RAISE NOTICE 'Extended tables: companies, reviews';
    RAISE NOTICE 'Next step: Execute 06_create_rls_for_new_tables.sql';
END $$;
