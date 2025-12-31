-- Dutuk Backend - Seed Categories Data
-- Execute this AFTER 06_create_rls_for_new_tables.sql

-- =====================================================
-- SEED CATEGORIES
-- =====================================================

-- Insert main categories
INSERT INTO public.categories (name, slug, description, icon, display_order, is_active) VALUES
('Wedding Planning', 'wedding-planning', 'Complete wedding event planning and coordination services', 'Heart', 1, true),
('Birthday Parties', 'birthday-parties', 'Birthday celebration planning for all ages', 'Cake', 2, true),
('Corporate Events', 'corporate-events', 'Professional corporate event management and conferences', 'Briefcase', 3, true),
('Photography', 'photography', 'Professional photography services for all events', 'Camera', 4, true),
('Videography', 'videography', 'Professional video recording and editing services', 'Video', 5, true),
('Catering', 'catering', 'Food and beverage services for events', 'UtensilsCrossed', 6, true),
('Entertainment', 'entertainment', 'DJs, bands, performers, and entertainers', 'Music', 7, true),
('Decoration', 'decoration', 'Event decoration, floral design, and styling', 'Flower2', 8, true),
('Venues', 'venues', 'Event venues and location rentals', 'MapPin', 9, true),
('Audio Visual', 'audio-visual', 'Sound systems, lighting, and AV equipment', 'Speaker', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories (optional - can be expanded later)
DO $$
DECLARE
    wedding_id UUID;
    photography_id UUID;
    entertainment_id UUID;
BEGIN
    -- Get parent category IDs
    SELECT id INTO wedding_id FROM public.categories WHERE slug = 'wedding-planning';
    SELECT id INTO photography_id FROM public.categories WHERE slug = 'photography';
    SELECT id INTO entertainment_id FROM public.categories WHERE slug = 'entertainment';
    
    -- Wedding subcategories
    IF wedding_id IS NOT NULL THEN
        INSERT INTO public.categories (name, slug, description, parent_id, display_order) VALUES
        ('Wedding Coordination', 'wedding-coordination', 'Full wedding coordination services', wedding_id, 1),
        ('Wedding Design', 'wedding-design', 'Wedding theme and design consultation', wedding_id, 2),
        ('Destination Weddings', 'destination-weddings', 'Destination wedding planning', wedding_id, 3)
        ON CONFLICT (slug) DO NOTHING;
    END IF;
    
    -- Photography subcategories
    IF photography_id IS NOT NULL THEN
        INSERT INTO public.categories (name, slug, description, parent_id, display_order) VALUES
        ('Wedding Photography', 'wedding-photography', 'Wedding photography services', photography_id, 1),
        ('Event Photography', 'event-photography', 'General event photography', photography_id, 2),
        ('Portrait Photography', 'portrait-photography', 'Portrait and family photography', photography_id, 3)
        ON CONFLICT (slug) DO NOTHING;
    END IF;
    
    -- Entertainment subcategories
    IF entertainment_id IS NOT NULL THEN
        INSERT INTO public.categories (name, slug, description, parent_id, display_order) VALUES
        ('DJ Services', 'dj-services', 'Professional DJ and music services', entertainment_id, 1),
        ('Live Bands', 'live-bands', 'Live music bands and performers', entertainment_id, 2),
        ('Entertainers', 'entertainers', 'Magicians, comedians, and performers', entertainment_id, 3)
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Display all categories
DO $$
DECLARE
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM public.categories;
    RAISE NOTICE '✅ Categories seeded successfully!';
    RAISE NOTICE 'Total categories: %', category_count;
END $$;

-- Show the categories
SELECT 
    CASE WHEN parent_id IS NULL THEN name ELSE '  └─ ' || name END as category,
    slug,
    is_active
FROM public.categories
ORDER BY 
    COALESCE(parent_id, id),
    display_order;
