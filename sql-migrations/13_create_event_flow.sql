-- Migration: 13_create_event_flow
-- Description: Sets up the Event Flow architecture (Project Management Model)
-- Note: 'planned_events' is used instead of 'events' to avoid conflict with existing vendor booking table.

-- 1. Add capacity field to companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS events_per_day_capacity INT DEFAULT 1;

-- 2. Create Parent Event Table (Project Container)
CREATE TABLE IF NOT EXISTS planned_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Child Inquiry Items Table
CREATE TABLE IF NOT EXISTS event_inquiry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES planned_events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES user_profiles(id), -- Assuming vendors are in user_profiles or companies? usually user_profiles.id is the vendor_id
  service_id UUID REFERENCES vendor_services(id), -- Optional: Link to specific service
  quoted_price DECIMAL(10, 2),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED')),
  conversation_id UUID REFERENCES conversations(id), -- Nullable, linked later
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE planned_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_inquiry_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- planned_events: Users can see/edit their own events
CREATE POLICY "Users can manage their own planned events" 
ON planned_events FOR ALL 
USING (auth.uid() = user_id);

-- event_inquiry_items: Users can see their own inquiries
CREATE POLICY "Users can manage their own inquiry items" 
ON event_inquiry_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM planned_events 
    WHERE planned_events.id = event_inquiry_items.event_id 
    AND planned_events.user_id = auth.uid()
  )
);

-- Vendors can see inquiries assigned to them
CREATE POLICY "Vendors can view inquiries assigned to them" 
ON event_inquiry_items FOR SELECT 
USING (vendor_id = auth.uid());

-- Vendors can update inquiries assigned to them (Accept/Reject)
CREATE POLICY "Vendors can update their inquiries" 
ON event_inquiry_items FOR UPDATE 
USING (vendor_id = auth.uid());

-- 6. Function: Check Vendor Availability
-- Returns TRUE if Confirmed Events < Capacity
CREATE OR REPLACE FUNCTION check_vendor_availability(
    target_vendor_id UUID, 
    target_date DATE
) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
    current_load INT;
    max_capacity INT;
BEGIN
    -- Get vendor capacity (default 1 if not set)
    SELECT COALESCE(events_per_day_capacity, 1) INTO max_capacity
    FROM companies
    WHERE user_id = target_vendor_id;
    
    IF max_capacity IS NULL THEN 
       max_capacity := 1; 
    END IF;

    -- Count confirmed bookings for this date
    SELECT COUNT(*) INTO current_load
    FROM event_inquiry_items i
    JOIN planned_events e ON i.event_id = e.id
    WHERE i.vendor_id = target_vendor_id
    AND e.event_date = target_date
    AND i.status = 'CONFIRMED'
    AND e.status != 'CANCELLED';

    RETURN current_load < max_capacity;
END;
$$;

-- 7. RPC: Create Event Bundle (Atomic Transaction)
CREATE OR REPLACE FUNCTION create_event_bundle(
    p_title TEXT,
    p_event_date DATE,
    p_items JSONB -- Array of {vendor_id, service_id, price}
) 
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
    new_event_id UUID;
    item JSONB;
BEGIN
    -- 1. Create Parent Event
    INSERT INTO planned_events (user_id, title, event_date, status)
    VALUES (auth.uid(), p_title, p_event_date, 'PLANNING')
    RETURNING id INTO new_event_id;

    -- 2. Loop through items and insert
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO event_inquiry_items (event_id, vendor_id, service_id, quoted_price, status)
        VALUES (
            new_event_id,
            (item->>'vendor_id')::UUID,
            (item->>'service_id')::UUID, -- Can be NULL
            (item->>'quoted_price')::DECIMAL,
            'PENDING'
        );
    END LOOP;

    RETURN new_event_id;
EXCEPTION WHEN OTHERS THEN
    -- Transaction rollback happens automatically on error
    RAISE;
END;
$$;
