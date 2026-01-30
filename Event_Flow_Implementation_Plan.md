# Dutuk Event Flow – Technical Implementation Plan

> **Philosophy**: Dutuk is pivoting from a "Service Directory" to a "Managed Workflow". Users aren't buying a service—they're **assembling a Team**.

---

## 1. Business Logic – "Rules of the Game"

### The "Bundle" Concept
- One **Event (Parent)** has many **EventInquiryItems (Children)**
- **Atomicity**: An event cannot exist without inquiry items. Creation must happen in a single transaction.

### Capacity vs Calendar
- Vendors do NOT have "blocked dates" manually
- **Availability = Confirmed Events < Daily Capacity**
- Cancelling an event immediately frees capacity

### The "Hot-Swap" (Repair Flow)
- If a Vendor **rejects**, item status becomes `REJECTED`
- User manually selects a replacement
- **Logic**: We do NOT delete the item. We **update** `vendor_id` on the existing item and reset status to `PENDING`

### No Payments (Free-to-Use Model)
- No payment gateway currently
- Risk of spam/ghosting mitigated via **Capacity Gating**

---

## 2. Database Schema ✅ IMPLEMENTED

### Tables Created

| Table | Purpose | Status |
|-------|---------|--------|
| `planned_events` | Parent Project Container | ✅ Created |
| `event_inquiry_items` | Child Vendor Inquiries | ✅ Created |
| `companies.events_per_day_capacity` | Vendor Capacity Field | ✅ Added |

### `planned_events` Schema
```sql
id UUID PRIMARY KEY
user_id UUID NOT NULL REFERENCES auth.users(id)
title TEXT NOT NULL
event_date DATE NOT NULL
status TEXT CHECK (status IN ('PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'))
created_at, updated_at TIMESTAMPTZ
```

### `event_inquiry_items` Schema
```sql
id UUID PRIMARY KEY
event_id UUID REFERENCES planned_events(id) ON DELETE CASCADE
vendor_id UUID REFERENCES user_profiles(id)
service_id UUID REFERENCES vendor_services(id) -- Optional
quoted_price DECIMAL(10, 2)
status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED'))
conversation_id UUID REFERENCES conversations(id) -- Nullable, linked later
created_at, updated_at TIMESTAMPTZ
```

### RLS Policies
- ✅ Users can manage their own `planned_events`
- ✅ Users can manage inquiry items for their events
- ✅ Vendors can view/update inquiries assigned to them

### RPC Functions ✅ IMPLEMENTED

#### `check_vendor_availability(vendor_id, date)` → Boolean
```sql
Logic: ConfirmedEvents < Capacity
- Counts from event_inquiry_items WHERE status = 'CONFIRMED'
- Joined with planned_events WHERE status != 'CANCELLED'
```

#### `create_event_bundle(title, date, items)` → UUID
```sql
Atomic Transaction:
1. INSERT planned_event (status = 'PLANNING')
2. LOOP: INSERT event_inquiry_items (status = 'PENDING')
3. RETURN new event_id
4. ROLLBACK on any failure
```

---

## 3. Frontend Types ✅ IMPLEMENTED

### [types/events.ts](file:///e:/My%20Programming%20Projects/dutuk-user/types/events.ts)

| Type | Purpose |
|------|---------|
| `EventStatus` | 'PLANNING' \| 'CONFIRMED' \| 'COMPLETED' \| 'CANCELLED' |
| `InquiryStatus` | 'PENDING' \| 'ACCEPTED' \| 'REJECTED' \| 'CONFIRMED' |
| `PlannedEvent` | Parent event interface |
| `EventInquiryItem` | Child inquiry with optional vendor/service joins |
| `CreateEventBundlePayload` | RPC payload structure |

---

## 4. State Management ✅ IMPLEMENTED

### [store/useEventWizardStore.ts](file:///e:/My%20Programming%20Projects/dutuk-user/store/useEventWizardStore.ts)

**Zustand Store** with persistence:

| State | Type |
|-------|------|
| `occasion` | string |
| `eventDate` | Date \| undefined |
| `guestCount` | number |
| `budgetMin`, `budgetMax` | number |
| `selectedItems` | WizardVendorItem[] |

**Actions**: `setOccasion`, `setEventDate`, `setBudget`, `addItem`, `removeItem`, `clearWizard`

---

## 5. API Hooks ✅ IMPLEMENTED

### [hooks/useFlowEvents.ts](file:///e:/My%20Programming%20Projects/dutuk-user/hooks/useFlowEvents.ts)

| Function | Purpose |
|----------|---------|
| `checkAvailability(vendorId, date)` | Calls `check_vendor_availability` RPC |
| `createEventBundle(payload)` | Calls `create_event_bundle` RPC |

---

## 6. User App UI ✅ IMPLEMENTED

### Entry Page (`/events/page.tsx`)
- [x] Split screen design
- [x] "Browse Vendors Manually" card → `/explore?type=vendors`
- [x] "Plan My Event" card → `/events/plan`
- [x] Animated with Framer Motion

### Wizard (`/events/plan/page.tsx`)
- [x] 5-step multi-step form
- [x] Step 1: Occasion selection (Wedding, Birthday, etc.)
- [x] Step 2: Date picker + Guest count slider
- [x] Step 3: Budget range sliders
- [x] Step 4: Services selection (Photography, Catering, etc.)
- [x] Step 5: Review & Submit
- [x] Zustand state persistence
- [x] Calls `create_event_bundle` RPC on submit

### Dashboard (`/events/[id]/page.tsx`)
- [x] Progress bar showing team assembly
- [x] Color-coded vendor cards (Green/Yellow/Red)
- [x] "Find Replacement" button on rejected items
- [x] Radix Sheet for repair flow (placeholder search)

### Repair RPC (`replace_vendor_in_bundle`)
- [x] Hot-swap function created
- [x] Validates event ownership
- [x] Resets status to PENDING

---

## 7. Vendor App ✅ IMPLEMENTED

### Hook (`hooks/useEventInquiries.ts`)
- [x] `getVendorInquiries(profileId)` - Fetch all inquiries
- [x] `getPendingInquiries(profileId)` - Fetch pending only
- [x] `getPendingInquiriesCount(profileId)` - Badge count
- [x] `acceptInquiry(id)` - Update status to ACCEPTED
- [x] `rejectInquiry(id)` - Update status to REJECTED

### Screen (`app/requests/inquiries.tsx`)
- [x] Filter tabs (Pending / All)
- [x] Inquiry cards with event title, date, price
- [x] Color-coded status badges
- [x] Accept button (green/maroon)
- [x] Reject button (red)
- [x] Pull-to-refresh
- [x] Empty state handling

---

## 8. Verification Checklist

### Database ✅
- [x] `planned_events` table exists
- [x] `event_inquiry_items` table exists
- [x] `events_per_day_capacity` column added to `companies`
- [x] `check_vendor_availability` function works
- [x] `create_event_bundle` function works
- [ ] `replaceVendorInBundle` RPC (pending)

### Frontend ✅
- [x] `types/events.ts` created
- [x] `store/useEventWizardStore.ts` created
- [x] `hooks/useFlowEvents.ts` created
- [x] `zustand` dependency installed

### UI ✅
- [x] Entry page `/events`
- [x] Wizard `/events/plan`
- [x] Dashboard `/events/[id]`
- [x] Vendor app inquiry cards (`/requests/inquiries`)

---

## 8. Migration File Reference

### [13_create_event_flow.sql](file:///e:/My%20Programming%20Projects/dutuk-user/sql-migrations/13_create_event_flow.sql)

Full migration applied to Supabase project.

---

## Next Steps

1. **Review this plan** – Confirm business logic alignment
2. **Create Wizard UI** – Multi-step form with Zustand state
3. **Create Dashboard UI** – Status cards with repair flow
4. **Create Repair RPC** – `replaceVendorInBundle` function
5. **Update Vendor App** – Inquiry acceptance/rejection
