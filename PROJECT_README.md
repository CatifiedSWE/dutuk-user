# EventHub - Event Management Platform

A modern Next.js event management and booking platform built with a modular architecture.

## Tech Stack

- **Next.js 14** (App Router)
- **React 19**
- **Tailwind CSS** for styling
- **Demo Data** (Supabase integration ready for future)

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Root redirect to /home
│   │
│   ├── (public)/            # Public routes
│   │   └── home/
│   │       └── page.tsx     # Homepage
│   │
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── vendor-login/
│   │
│   ├── (user)/              # User portal routes
│   │   ├── events/
│   │   │   ├── list/
│   │   │   └── details/[eventId]/
│   │   ├── vendors/
│   │   │   └── list/
│   │   ├── bookings/
│   │   │   ├── checkout/
│   │   │   └── confirmation/
│   │   └── profile/
│   │       ├── overview/
│   │       └── settings/
│   │
│   ├── (vendor)/            # Vendor portal routes (placeholders)
│   │   ├── dashboard/
│   │   ├── events/
│   │   │   ├── manage/
│   │   │   └── create/
│   │   └── bookings/
│   │
│   └── middleware.ts        # Route protection (placeholder)
│
├── modules/                 # Feature modules
│   ├── auth/
│   │   ├── README.md
│   │   └── screens/        # Login, Signup, VendorLogin
│   │
│   ├── events/
│   │   ├── README.md
│   │   ├── user/           # EventListScreen, EventDetailsScreen
│   │   └── vendor/         # VendorDashboard (placeholder)
│   │
│   ├── bookings/
│   │   ├── README.md
│   │   └── user/           # CheckoutScreen, ConfirmationScreen
│   │
│   ├── vendors/
│   │   ├── README.md
│   │   └── user/           # VendorListScreen
│   │
│   ├── profile/
│   │   ├── README.md
│   │   └── user/           # OverviewScreen, SettingsScreen
│   │
│   ├── homepage/
│   │   ├── README.md
│   │   ├── index.tsx
│   │   └── sections/       # Hero, Categories, FeaturedEvents
│   │
│   ├── layouts/
│   │   ├── README.md
│   │   ├── user/
│   │   │   ├── desktop/   # Navbar, Footer
│   │   │   └── mobile/    # Topbar, BottomNav
│   │   └── vendor/        # (future)
│   │
│   └── common/
│       ├── README.md
│       └── shared-ui/      # Button, Card components
│
├── demo/                   # Mock data
│   ├── events.ts
│   ├── vendors.ts
│   ├── bookings.ts
│   └── index.ts
│
├── domain/                 # Type definitions
│   ├── event.ts
│   ├── booking.ts
│   ├── vendor.ts
│   └── user.ts
│
├── lib/
│   ├── utils.ts           # Utility functions (cn helper)
│   └── supabase/          # (future integration)
│
└── styles/
    └── globals.css        # Global styles
```

## Architecture Pattern

The project follows a **Module → Demo → App** architecture:

1. **Modules** (`/src/modules/`): Self-contained feature modules with components and business logic
2. **Demo Data** (`/src/demo/`): Mock data for development (easy to replace with API calls)
3. **App Routes** (`/src/app/`): Routing layer that orchestrates modules

### Key Principles

- **Feature-First Organization**: Components grouped by feature, not by type
- **Modular Design**: Each module is self-contained and reusable
- **No Hardcoded Data**: All data comes from demo files for easy API integration
- **Responsive Design**: Desktop and mobile layouts with breakpoint at 1024px
- **Route Groups**: Organized routes using Next.js route groups for clean URLs

## Features Implemented

### User Portal (Fully Functional)
✅ **Homepage**: Hero section, categories, featured events
✅ **Events**: Browse, search, filter, and view event details
✅ **Vendors**: View event organizers and their profiles
✅ **Bookings**: Complete checkout flow with confirmation
✅ **Profile**: View bookings and manage settings
✅ **Auth Screens**: Login, Signup (placeholder implementations)

### Vendor Portal (Placeholder)
🚧 Dashboard, Event Management, Booking Management (ready for future development)

## Getting Started

```bash
# The app is already running on port 3000
# Visit: http://localhost:3000
```

## Navigation

### Desktop (>1024px)
- Top navbar with logo and navigation links
- Footer with links and company info

### Mobile (<1024px)
- Top bar with logo
- Bottom navigation with 4 tabs: Home, Events, Vendors, Profile

## Demo Data

All data is currently mock data from `/src/demo/`:
- 6 sample events across different categories
- 4 verified vendors/organizers
- 2 sample bookings

## Future Enhancements

- [ ] Supabase authentication integration
- [ ] Real-time event availability updates
- [ ] Payment processing integration
- [ ] Vendor portal full implementation
- [ ] Advanced search and filtering
- [ ] Event reviews and ratings
- [ ] Email notifications
- [ ] Calendar integration

## File Naming Conventions

- **Components**: PascalCase (e.g., `EventListScreen.tsx`)
- **Files**: Match component names
- **Folders**: kebab-case (e.g., `event-details/`)
- **Barrel Exports**: Each module folder has an `index.ts` for clean imports

## Import Paths

```typescript
// Modules
import { EventListScreen } from '@/modules/events/user';

// Demo data
import { demoEvents, demoVendors } from '@/demo';

// Domain types
import { Event, Booking } from '@/domain/event';

// Common components
import { Button, Card } from '@/modules/common/shared-ui';

// Utils
import { cn } from '@/lib/utils';
```

## Color Scheme

- **Primary**: Blue (#2563EB)
- **Secondary**: Purple
- **Accent**: Pink
- **Success**: Green
- **Warning**: Yellow

## Route Structure

```
/                          → Redirects to /home
/home                      → Homepage
/login                     → User login
/signup                    → User registration
/vendor-login              → Vendor login
/events/list               → Browse all events
/events/details/:id        → Event details
/vendors/list              → Browse vendors
/bookings/checkout         → Booking checkout
/bookings/confirmation     → Booking success
/profile/overview          → User profile & bookings
/profile/settings          → Edit profile
/vendor/dashboard          → Vendor dashboard (placeholder)
/vendor/events/manage      → Manage events (placeholder)
/vendor/events/create      → Create event (placeholder)
/vendor/bookings           → Vendor bookings (placeholder)
```

## Notes

- All auth is currently placeholder - users can access all routes
- Vendor portal has basic structure but minimal functionality
- Mobile-responsive with beautiful UI using Tailwind CSS
- Dark mode support ready (Tailwind dark: prefix used throughout)
