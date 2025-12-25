# Demo Data Documentation

This folder contains all mock/demo data used throughout the application. All data structures are centralized here for easy management and future Supabase integration.

## 📁 Data Files Overview

### 1. **events.ts**
Contains event listing data and event categories for the event management platform.

**Exports:**
- `demoCategories: EventCategory[]` - Event category types (Conferences, Workshops, Concerts, etc.)
- `demoEvents: Event[]` - Sample event listings with full details

**Structure:**
```typescript
Event {
  id, title, description, category, date, time, location, 
  venue, price, currency, capacity, availableSeats, 
  vendorId, vendorName, imageUrl, tags, featured, status
}
```

**Usage:** Event list page, event details, featured events section

---

### 2. **vendors.ts**
Contains vendor/organizer profile information.

**Exports:**
- `demoVendors: Vendor[]` - Sample vendor profiles

**Structure:**
```typescript
Vendor {
  id, name, email, phone, description, logo, rating, 
  totalEvents, verified, specialties, location, joinedDate
}
```

**Usage:** Vendor listing page, vendor profiles

---

### 3. **bookings.ts**
Contains user booking history data.

**Exports:**
- `demoBookings: Booking[]` - Sample booking records

**Structure:**
```typescript
Booking {
  id, eventId, userId, userName, userEmail, numberOfTickets,
  totalAmount, currency, bookingDate, status, paymentStatus,
  eventDetails: { title, date, time, location }
}
```

**Usage:** User profile, booking history, confirmation pages

---

### 4. **categories.ts**
Contains event category cards displayed on the homepage.

**Exports:**
- `eventCategoriesData: EventCategory[]` - Homepage event categories (Family, Governance, Surprise, Colleges, Shoot)

**Structure:**
```typescript
EventCategory {
  name: string
  image: string (path to category image)
}
```

**Usage:** Homepage Event Categories section

---

### 5. **vendorCategories.ts**
Contains vendor service categories and navigation tabs.

**Exports:**
- `vendorCategoriesData: VendorCategory[]` - Vendor service types with pricing
- `vendorTabs: string[]` - Tab navigation options for filtering vendors

**Structure:**
```typescript
VendorCategory {
  name: string (e.g., "Disc Jockey (DJ)")
  price: string (e.g., "₹ 10,000 - ₹ 60,000")
  image: string (path to vendor category image)
}
```

**Usage:** Homepage Vendor Categories section

---

### 6. **bundleServices.ts**
Contains event bundle packages for different event types.

**Exports:**
- `bundleServicesData: BundleService[]` - Event bundle packages

**Structure:**
```typescript
BundleService {
  title: string (e.g., "Birthday Party for 100 people")
  price: string (e.g., "₹ 2,00,000 - ₹ 5,00,000")
  image: string (path to bundle image)
}
```

**Usage:** Homepage Bundle Services section

---

### 7. **premiumEvents.ts**
Contains premium event venue listings.

**Exports:**
- `premiumEventsData: PremiumEvent[]` - Premium event venues and packages

**Structure:**
```typescript
PremiumEvent {
  title: string (e.g., "ECR Beach House Wedding")
  location: string (e.g., "Chennai, Egmore")
  price: string (e.g., "₹ 2,00,000 - ₹ 5,00,000")
  image: string (path to event image)
  premium: boolean (always true for premium events)
}
```

**Usage:** Homepage Premium Event Planning section

---

## 🔄 Importing Data

All data is exported through `index.ts` for convenient imports:

```typescript
// Import specific data
import { demoEvents, demoVendors } from '@/demo';

// Import all
import * from '@/demo';
```

## 🚀 Supabase Migration Ready

All data structures are organized to facilitate easy migration to Supabase:

1. **Type-safe:** All data has TypeScript interfaces defined in `/domain/` folder
2. **Consistent IDs:** All records use string-based IDs (Supabase compatible)
3. **Normalized structure:** Data is separated by entity type
4. **Easy replacement:** Components import from `/demo`, making it easy to swap with API calls

### Migration Path:
```typescript
// Current (Demo)
import { demoEvents } from '@/demo';

// Future (Supabase)
const { data: events } = await supabase.from('events').select('*');
```

## 📝 Adding New Data

To add new demo data:

1. Create a new `.ts` file in `/demo/` folder
2. Define TypeScript interfaces (or import from `/domain/`)
3. Export data array with descriptive name (e.g., `demoXYZ`)
4. Add export to `/demo/index.ts`
5. Update this README with documentation

## 🎨 Image Assets

All data references images stored in `/public/` folder:
- `/public/categories/` - Event category images
- `/public/vendors/` - Vendor service images
- `/public/bundles/` - Bundle service images
- `/public/events/` - Event and venue images

---

**Note:** This data is for development and demonstration purposes. Replace with actual database queries when integrating with Supabase.
