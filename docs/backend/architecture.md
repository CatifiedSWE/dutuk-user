# Backend Architecture

## Overview

Dutuk uses **Supabase (PostgreSQL)** as the backend database with comprehensive Row Level Security (RLS) policies to ensure data privacy and security.

## Database Schema

### Core Tables

The application uses **16 tables** supporting both customer and vendor features:

#### 1. **user_profiles**
Base user table for authentication and role management.
```sql
- user_id: UUID (FK to auth.users) - Primary user identifier
- role: TEXT - User role ('customer' or 'vendor')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Default Role**: 'customer' (set by `handle_new_user()` trigger)
- **Purpose**: Links Supabase auth users to application roles

#### 2. **customer_profiles**
Extended profile information for customer users.
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users, UNIQUE) - Links to auth user
- full_name: TEXT - Customer full name
- phone: TEXT - Contact phone number
- avatar_url: TEXT - Profile picture URL
- address: TEXT - Street address
- city: TEXT - City name
- state: TEXT - State/province
- postal_code: TEXT - ZIP/postal code
- country: TEXT (default: 'USA')
- preferred_categories: TEXT[] - Array of preferred event categories
- budget_range: TEXT - Budget preference ('low', 'medium', 'high', 'luxury')
- notification_preferences: JSONB - Email/SMS/push notification settings
- total_bookings: INTEGER (default: 0)
- total_spent: DECIMAL(10, 2) (default: 0)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Created**: Automatically after user signup via auth flow
- **Used By**: User onboarding, profile settings, personalization

#### 3. **companies**
Vendor company information and discovery data.
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users) - Links to vendor user
- company: TEXT - Company name
- description: TEXT - Company description
- logo_url: TEXT - Company logo
- category: TEXT - Primary service category
- subcategories: TEXT[] - Additional service categories
- service_area: TEXT - Geographic area served (city/region)
- years_in_business: INTEGER - Years of operation
- is_active: BOOLEAN (default: true) - Active/inactive status
- verified_at: TIMESTAMP - Verification timestamp
- avg_rating: DECIMAL(3, 2) (default: 0) - Auto-calculated average rating
- total_reviews: INTEGER (default: 0) - Auto-calculated review count
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Indexes**: category, service_area, full-text search
- **Auto-Updated**: avg_rating and total_reviews via trigger

#### 4. **vendor_services**
Public catalog of vendor service offerings/packages.
```sql
- id: UUID (Primary Key)
- vendor_id: UUID (FK to auth.users) - Service owner
- company_id: UUID (FK to companies) - Associated company
- service_name: TEXT - Service title
- service_type: TEXT - Type of service (wedding, birthday, corporate, etc.)
- description: TEXT - Full description
- short_description: TEXT - Brief summary
- base_price: DECIMAL(10, 2) - Starting price
- price_type: TEXT - Pricing model ('fixed', 'per_person', 'per_hour', 'per_day', 'custom')
- currency: TEXT (default: 'USD')
- is_active: BOOLEAN (default: true) - Active/inactive
- max_bookings_per_day: INTEGER (default: 1)
- min_notice_days: INTEGER (default: 7) - Minimum booking notice
- featured_image: TEXT - Main service image
- gallery_images: TEXT[] - Additional images
- tags: TEXT[] - Search tags
- category: TEXT - Primary category
- subcategory: TEXT - Secondary category
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Public Access**: Anonymous users can browse active services
- **Vendor Access**: Full CRUD for own services

#### 5. **events**
Event listings created by vendors.
```sql
- id: UUID (Primary Key)
- vendor_id: UUID (FK to auth.users) - Event creator
- title: TEXT - Event name
- description: TEXT - Event description
- event_date: TIMESTAMP - Event date/time
- location: TEXT - Event venue/location
- status: TEXT - Event status ('upcoming', 'ongoing', 'completed', 'cancelled')
- image_url: TEXT - Event banner image
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Public Read**: All users can view events
- **RLS Enabled**: Public can read, vendors can manage own events

#### 6. **categories**
Service and event categorization system.
```sql
- id: UUID (Primary Key)
- name: TEXT (UNIQUE) - Category name
- slug: TEXT (UNIQUE) - URL-friendly identifier
- description: TEXT - Category description
- icon: TEXT - Icon identifier (Lucide React icon name)
- display_order: INTEGER (default: 0) - Sort order
- is_active: BOOLEAN (default: true)
- parent_id: UUID (FK to categories, nullable) - For subcategories
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Seeded Categories**: Wedding Planning, Birthday Parties, Corporate Events, Photography, Videography, Catering, Entertainment, Decoration, Venues, Audio Visual
- **Hierarchical**: Supports parent-child relationships

#### 7. **requests**
Booking requests from customers to vendors.
```sql
- id: UUID (Primary Key)
- customer_id: UUID (FK to auth.users) - Requesting customer
- vendor_id: UUID (FK to auth.users) - Target vendor
- service_id: UUID (FK to vendor_services, nullable) - Requested service
- event_date: DATE - Desired event date
- event_type: TEXT - Type of event
- guest_count: INTEGER - Expected number of guests
- budget: DECIMAL(10, 2) - Customer budget
- location: TEXT - Event location
- message: TEXT - Additional details/requirements
- status: TEXT - Request status ('pending', 'accepted', 'declined', 'completed')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Purpose**: Customer inquiries and booking requests

#### 8. **orders**
Confirmed bookings and transactions.
```sql
- id: UUID (Primary Key)
- customer_id: UUID (FK to auth.users)
- vendor_id: UUID (FK to auth.users)
- request_id: UUID (FK to requests, nullable)
- service_id: UUID (FK to vendor_services, nullable)
- event_date: DATE
- total_amount: DECIMAL(10, 2)
- status: TEXT - Order status
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 9. **reviews**
Customer reviews for vendors.
```sql
- id: UUID (Primary Key)
- customer_id: UUID (FK to auth.users) - Reviewer
- vendor_id: UUID (FK to auth.users) - Reviewed vendor
- order_id: UUID (FK to orders, nullable) - Associated order
- rating: INTEGER - Star rating (1-5)
- review_text: TEXT - Review content
- photos: TEXT[] - Review photos
- helpful_count: INTEGER (default: 0) - Helpfulness votes
- verified_booking: BOOLEAN (default: false) - Verified purchase
- response: TEXT - Vendor response
- response_at: TIMESTAMP - Response timestamp
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```
- **Triggers**: Auto-updates company avg_rating and total_reviews

#### 10. **favorites**
Customer wishlist for vendors and services.
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users) - Customer
- vendor_id: UUID (FK to auth.users, nullable) - Favorited vendor
- service_id: UUID (FK to vendor_services, nullable) - Favorited service
- created_at: TIMESTAMP
```
- **Constraints**: Must have either vendor_id OR service_id
- **Helper Function**: `toggle_favorite()` RPC for add/remove

#### 11. **notifications**
In-app notification system.
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users) - Notification recipient
- type: TEXT - Notification type ('booking_request', 'booking_accepted', etc.)
- title: TEXT - Notification title
- message: TEXT - Notification message
- data: JSONB - Additional metadata (IDs, links, etc.)
- is_read: BOOLEAN (default: false)
- read_at: TIMESTAMP - When marked as read
- priority: TEXT (default: 'normal') - Priority level ('low', 'normal', 'high', 'urgent')
- created_at: TIMESTAMP
```
- **Helper Functions**: `mark_notification_read()`, `mark_all_notifications_read()`

#### 12. **payments**
Payment transaction records.
```sql
- id: UUID (Primary Key)
- order_id: UUID (FK to orders)
- amount: DECIMAL(10, 2)
- payment_method: TEXT
- status: TEXT - Payment status
- transaction_id: TEXT - External payment processor ID
- created_at: TIMESTAMP
```

#### 13. **earnings**
Vendor earnings tracking.
```sql
- id: UUID (Primary Key)
- vendor_id: UUID (FK to auth.users)
- order_id: UUID (FK to orders)
- amount: DECIMAL(10, 2)
- status: TEXT - Payout status
- created_at: TIMESTAMP
```

#### 14. **dates**
Vendor availability calendar.
```sql
- id: UUID (Primary Key)
- vendor_id: UUID (FK to auth.users)
- date: DATE
- is_available: BOOLEAN
- notes: TEXT
- created_at: TIMESTAMP
```

#### 15. **conversations**
Chat conversations between customers and vendors.
```sql
- id: UUID (Primary Key)
- customer_id: UUID (FK to auth.users) - Customer participant
- vendor_id: UUID (FK to auth.users) - Vendor participant
- terms_accepted_by_customer: BOOLEAN (default: false) - T&C acceptance flag
- terms_accepted_at: TIMESTAMP - When T&C was accepted
- payment_completed: BOOLEAN (default: false) - Payment gate for contact sharing
- payment_completed_at: TIMESTAMP - When payment was completed
- booking_id: UUID (FK to events, nullable) - Links to booking/event
- last_message_at: TIMESTAMP (default: NOW())
- last_message_preview: TEXT - Preview of last message
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(customer_id, vendor_id) - One conversation per customer-vendor pair
```
- **Purpose**: Tracks chat metadata and enforces business rules (T&C, contact blocking)
- **Business Rules**: 
  - Users must accept T&C before first message
  - Contact info blocked until payment_completed = true
  - One conversation per customer-vendor pair
- **Auto-Updated**: last_message_at and last_message_preview via trigger

#### 16. **messages**
Individual messages within conversations.
```sql
- id: UUID (Primary Key)
- conversation_id: UUID (FK to conversations) - Parent conversation
- sender_id: UUID (FK to auth.users) - Message sender
- receiver_id: UUID (FK to auth.users) - Message recipient
- message_text: TEXT (NOT NULL) - Message content
- has_attachment: BOOLEAN (default: false) - Attachment flag
- attachment_url: TEXT - Supabase Storage URL
- attachment_name: TEXT - Original filename
- attachment_size: TEXT - Human-readable size
- attachment_type: TEXT - MIME type or extension
- is_read: BOOLEAN (default: false) - Read status
- read_at: TIMESTAMP - When message was read
- created_at: TIMESTAMP
- CHECK: Must have either message_text OR attachment
```
- **Purpose**: Stores actual message content with attachment support
- **Real-time**: Enabled for instant message delivery
- **Read Tracking**: is_read and read_at for message status
- **Validation**: Messages must have text or attachment (enforced by CHECK constraint)

## Database Features

### Row Level Security (RLS)
All tables have comprehensive RLS policies:
- **Public Read**: Categories, active vendor_services, events
- **User-Scoped**: customer_profiles, favorites, notifications (users can only access their own)
- **Vendor-Scoped**: companies, vendor_services (vendors manage their own)
- **Chat-Scoped**: conversations, messages (participants can only access their own conversations)
- **Anonymous Access**: Browse services and events without authentication

**Chat-Specific RLS Policies:**
- Users can view/update conversations they participate in (as customer or vendor)
- Users can view/send messages only in their own conversations
- Users can mark received messages as read
- Users cannot delete conversations or messages (history preservation)
- Real-time enabled for instant message delivery

### Triggers & Functions

**Automatic Triggers:**
1. `handle_new_user()` - Creates user_profile with 'customer' role on signup
2. `update_company_rating()` - Recalculates avg_rating when reviews change
3. `handle_updated_at()` - Auto-updates updated_at timestamps
4. `update_conversation_on_message()` - Updates conversation metadata when new message is sent

**Helper Functions:**
1. `is_vendor(user_id)` - Check if user is a vendor
2. `is_customer(user_id)` - Check if user is a customer
3. `get_user_company_name(user_id)` - Get vendor's company name
4. `toggle_favorite()` - Add/remove favorites
5. `mark_notification_read()` - Mark single notification as read
6. `mark_all_notifications_read()` - Mark all user notifications as read
7. `search_vendors()` - Full-text search for vendors
8. `get_unread_count(user_id)` - Get unread message counts per conversation
9. `mark_conversation_as_read(conversation_id, user_id)` - Mark all messages as read
10. `is_conversation_participant(conversation_id, user_id)` - Check conversation access

**Database Views:**
1. `conversations_with_users` - Conversations with full participant details (customer name, vendor name, avatars, emails)

### Indexes
Optimized for common queries:
- Full-text search on companies (company name + description)
- Full-text search on vendor_services (service name + description)
- Category-based filtering (vendor_services, companies)
- User-scoped queries (customer_profiles, favorites, notifications)
- Chat queries (conversations by customer/vendor, messages by conversation, unread messages)

## API Integration

### Custom React Hooks

The application uses custom hooks to interact with Supabase. All hooks include loading states, error handling, and TypeScript types.

#### Authentication Hooks

**Location**: `/hooks/useAuth.ts`
```typescript
useAuth() - Real-time authentication state
```

#### Vendor Hooks

**Location**: `/hooks/useVendors.ts`
```typescript
useVendors(options?) - Fetch vendors with filters
  • category?: string - Filter by category
  • search?: string - Search by name
  • limit?: number - Limit results
  • Returns: { data, loading, error }

useVendor(id: string) - Get single vendor
  • Returns: { data, loading, error }
```

#### Service Hooks

**Location**: `/hooks/useVendorServices.ts`
```typescript
useVendorServices(options?) - Fetch services
  • vendorId?: string - Filter by vendor
  • category?: string - Filter by category
  • serviceType?: string - Filter by type
  • Returns: { data, loading, error }

useService(id: string) - Get single service
  • Returns: { data, loading, error }
```

#### Booking Hooks

**Location**: `/hooks/useBookingRequest.ts`
```typescript
useBookingRequest() - Create booking request
  • createRequest(data) - Submit booking request
  • Returns: { createRequest, loading, error }

useMyBookingRequests() - Get user's requests
  • Returns: { data, loading, error }
```

#### Category Hooks

**Location**: `/hooks/useCategories.ts`
```typescript
useCategories() - Fetch all categories
  • Returns: { data, loading, error }
```

#### Review Hooks

**Location**: `/hooks/useReviews.ts`
```typescript
useReviews(vendorId: string) - Get vendor reviews
  • Returns: { data, loading, error }

useCreateReview() - Submit new review
  • createReview(data) - Post review
  • Returns: { createReview, loading, error }
```

#### Favorites Hooks

**Location**: `/hooks/useFavorites.ts`
```typescript
useFavorites() - Manage favorites
  • favorites - Array of user favorites
  • toggleFavorite(id, type) - Add/remove favorite
  • isFavorite(id) - Check if item is favorited
  • Returns: { favorites, toggleFavorite, isFavorite, loading, error }
```

#### Chat Hooks

**Location**: `/hooks/useConversations.ts`
```typescript
useConversations() - Fetch user's conversations
  • Real-time updates enabled
  • Returns: { data, loading, error }

useConversation(id: string) - Get single conversation
  • Returns: { data, loading, error }

useCreateConversation() - Start new conversation
  • Returns: { createConversation, loading, error }
```

**Location**: `/hooks/useMessages.ts`
```typescript
useMessages(conversationId: string) - Fetch messages
  • Real-time updates enabled
  • Returns: { data, loading, error }

useSendMessage() - Send new message
  • Validates contact info before sending
  • Handles T&C enforcement
  • Returns: { sendMessage, loading, error }

useMarkAsRead() - Mark messages as read
  • Returns: { markAsRead, loading, error }
```

### Supabase RPC Functions

The following server-side functions can be called from the client:

```typescript
// Toggle favorite (add/remove)
supabase.rpc('toggle_favorite', {
  target_vendor_id: 'uuid',
  target_service_id: 'uuid'
})

// Mark notification as read
supabase.rpc('mark_notification_read', {
  notification_id: 'uuid'
})

// Mark all notifications as read
supabase.rpc('mark_all_notifications_read')

// Search vendors with full-text search
supabase.rpc('search_vendors', {
  search_query: 'text',
  category_filter: 'category' // optional
})

// Get unread message count
supabase.rpc('get_unread_count', {
  user_id_param: 'uuid'
})

// Mark conversation as read
supabase.rpc('mark_conversation_as_read', {
  conversation_id_param: 'uuid',
  user_id_param: 'uuid'
})

// Check if user is conversation participant
supabase.rpc('is_conversation_participant', {
  conversation_id_param: 'uuid',
  user_id_param: 'uuid'
})
```

### Data Flow Pattern

```
Component
    ↓
Custom Hook (useVendors, useServices, etc.)
    ↓
Supabase Client (@/lib/supabase/client)
    ↓
Supabase Database (PostgreSQL)
    ↓
Row Level Security Check
    ↓
Return Data
    ↓
Hook State Management
    ↓
Component Re-render
```

## Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Where to find Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
4. Copy **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Migration Files

Database schema is managed through SQL migrations located in `/sql-migrations/`:

1. **05_extend_schema_for_users.sql** - Core schema (14 tables)
2. **06_create_rls_for_new_tables.sql** - RLS policies and helper functions
3. **07_seed_categories.sql** - Initial category data
4. **08_enable_events_rls.sql** - Public read access for events
5. **09_create_chat_tables.sql** - Chat conversations and messages tables
6. **10_create_rls_for_chat_tables.sql** - Chat RLS policies and helper functions

## Security Features

### Authentication Flow

```
User Signs Up (Email/Google)
         ↓
Supabase Auth creates user in auth.users
         ↓
Database Trigger: handle_new_user()
         ↓
Creates entry in user_profiles (role: 'customer')
         ↓
Frontend: verifyOTP() or OAuth callback
         ↓
Creates entry in customer_profiles
         ↓
Redirects to /onboarding/name
         ↓
User completes onboarding (name, location, photo)
         ↓
Updates customer_profiles
         ↓
Middleware checks onboarding status
         ↓
Redirects to /home (onboarding complete)
```

### Database Tables Quick Reference

| Table | Purpose | Public Read | User Access |
|-------|---------|-------------|-------------|
| `user_profiles` | User roles | No | Own only |
| `customer_profiles` | Customer data | No | Own only |
| `companies` | Vendor companies | Yes (active) | Vendors: own |
| `vendor_services` | Service catalog | Yes (active) | Vendors: own |
| `events` | Event listings | Yes (all) | Vendors: own |
| `categories` | Service categories | Yes (active) | Read only |
| `requests` | Booking requests | No | Own only |
| `orders` | Confirmed bookings | No | Own only |
| `reviews` | Vendor reviews | Yes | Customers: create |
| `favorites` | User wishlist | No | Own only |
| `notifications` | In-app notifications | No | Own only |
| `payments` | Payment records | No | Own only |
| `earnings` | Vendor earnings | No | Vendors: own |
| `dates` | Vendor availability | No | Vendors: own |
| `conversations` | Chat conversations | No | Participants only |
| `messages` | Chat messages | No | Participants only |

## Performance Optimization

- ✅ Indexes on frequently queried columns
- ✅ Composite indexes for common joins
- ✅ Materialized views for analytics (future)
- ✅ Connection pooling (Supabase default)

## For More Details

- See `/docs/backend/BACKEND_INTEGRATION_SUMMARY.md` for integration summary
- See `/docs/backend/UNIFIED_BACKEND_ARCHITECTURE.md` for complete architectural plan
- See `/docs/backend/MIGRATION_SUMMARY.md` for database migration details
