# Dutuk - Event Management Platform

A modern, fully TypeScript-based event management and booking platform built with Next.js 14, featuring a modular architecture and responsive design.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (100% type-safe)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: MongoDB (ready for integration)
- **Package Manager**: Yarn

## 📁 Project Structure

```
/app/
├── app/                          # Next.js App Router (TypeScript)
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Root redirect to /home
│   ├── globals.css              # Global styles
│   ├── middleware.ts            # Route protection middleware
│   │
│   ├── (public)/                # Public routes group
│   │   └── home/
│   │       └── page.tsx         # Homepage
│   │
│   ├── (auth)/                  # Authentication routes group
│   │   ├── login/
│   │   │   └── page.tsx         # User login
│   │   ├── signup/
│   │   │   └── page.tsx         # User registration
│   │   └── vendor-login/
│   │       └── page.tsx         # Vendor login
│   │
│   ├── (user)/                  # User portal routes group
│   │   ├── events/
│   │   │   ├── list/
│   │   │   │   └── page.tsx     # Browse all events
│   │   │   └── details/[eventId]/
│   │   │       └── page.tsx     # Event details
│   │   ├── vendors/
│   │   │   └── list/
│   │   │       └── page.tsx     # Browse vendors
│   │   ├── bookings/
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx     # Booking checkout
│   │   │   └── confirmation/
│   │   │       └── page.tsx     # Booking confirmation
│   │   └── profile/
│   │       ├── overview/
│   │       │   └── page.tsx     # User profile & bookings
│   │       └── settings/
│   │           └── page.tsx     # Edit profile settings
│   │
│   └── (vendor)/                # Vendor portal routes (placeholders)
│       ├── dashboard/
│       ├── events/
│       │   ├── manage/
│       │   └── create/
│       └── bookings/
│
├── modules/                     # Feature modules (TypeScript)
│   ├── auth/
│   │   ├── README.md
│   │   └── screens/
│   │       ├── LoginScreen.tsx
│   │       ├── SignupScreen.tsx
│   │       └── VendorLoginScreen.tsx
│   │
│   ├── events/
│   │   ├── README.md
│   │   ├── user/
│   │   │   ├── EventListScreen.tsx
│   │   │   └── EventDetailsScreen.tsx
│   │   └── vendor/
│   │       └── VendorDashboard.tsx
│   │
│   ├── bookings/
│   │   ├── README.md
│   │   └── user/
│   │       ├── CheckoutScreen.tsx
│   │       └── ConfirmationScreen.tsx
│   │
│   ├── vendors/
│   │   ├── README.md
│   │   └── user/
│   │       └── VendorListScreen.tsx
│   │
│   ├── profile/
│   │   ├── README.md
│   │   └── user/
│   │       ├── ProfileOverviewScreen.tsx
│   │       └── ProfileSettingsScreen.tsx
│   │
│   ├── homepage/
│   │   ├── README.md
│   │   ├── index.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── CategoriesSection.tsx
│   │       └── FeaturedEventsSection.tsx
│   │
│   ├── layouts/
│   │   ├── README.md
│   │   ├── user/
│   │   │   ├── desktop/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── mobile/
│   │   │       ├── Topbar.tsx
│   │   │       └── BottomNav.tsx
│   │   └── vendor/              # (future implementation)
│   │
│   └── common/
│       ├── README.md
│       └── shared-ui/
│           ├── Button.tsx
│           └── Card.tsx
│
├── domain/                      # TypeScript type definitions
│   ├── event.ts                # Event types
│   ├── booking.ts              # Booking types
│   ├── vendor.ts               # Vendor types
│   └── user.ts                 # User types
│
├── demo/                        # Mock data (TypeScript)
│   ├── events.ts               # Demo event data
│   ├── vendors.ts              # Demo vendor data
│   ├── bookings.ts             # Demo booking data
│   └── index.ts                # Barrel export
│
├── lib/                         # Utilities (TypeScript)
│   ├── utils.ts                # Helper functions (cn utility)
│   └── supabase/               # (future integration)
│
├── hooks/                       # Custom React hooks (TypeScript)
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
│
├── components/                  # Shared UI components
│   └── ui/                     # Reusable UI components
│
├── styles/
│   └── globals.css             # Global styles
│
├── .env                        # Environment variables
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## 🏗️ Architecture Pattern

The project follows a **Module → Demo → App** architecture:

### 1. **Modules** (`/modules/`)
Self-contained feature modules with components and business logic. Each module:
- Is fully typed with TypeScript
- Contains its own README.md
- Exports components via barrel exports (`index.ts`)
- Follows feature-first organization

### 2. **Demo Data** (`/demo/`)
Mock data for development that mimics real API responses:
- All data structures are fully typed
- Easy to replace with actual API calls
- Centralized in one location

### 3. **App Routes** (`/app/`)
Next.js App Router that orchestrates modules:
- Uses route groups for clean organization
- File-based routing with TypeScript
- Server and client components properly separated

### Key Architectural Principles

✅ **Type Safety First**: 100% TypeScript with strict typing  
✅ **Feature-First Organization**: Components grouped by feature, not by type  
✅ **Modular Design**: Each module is self-contained and reusable  
✅ **No Hardcoded Data**: All data comes from typed demo files  
✅ **Responsive Design**: Mobile-first with breakpoint at 1024px  
✅ **Route Groups**: Organized routes using Next.js route groups  
✅ **Separation of Concerns**: Clear boundaries between UI, logic, and data

## ✨ Features Implemented

### User Portal (Fully Functional)

✅ **Homepage**
- Hero section with call-to-action
- Category browsing
- Featured events showcase

✅ **Events**
- Browse all events with search and filters
- View detailed event information
- Responsive card layouts

✅ **Vendors**
- Browse event organizers
- View vendor profiles and ratings
- See vendor's event listings

✅ **Bookings**
- Complete checkout flow
- Booking confirmation page
- Ticket management

✅ **Profile**
- View user profile and booking history
- Edit profile settings
- Manage preferences

✅ **Authentication Screens**
- User login (placeholder)
- User signup (placeholder)
- Vendor login (placeholder)

### Vendor Portal (Placeholder)

🚧 **Dashboard**: Ready for implementation  
🚧 **Event Management**: Create and manage events  
🚧 **Booking Management**: View and manage bookings

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- Yarn package manager
- MongoDB instance (optional for demo)

### Installation

The application is already set up and running. To start development:

```bash
# Install dependencies (if needed)
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

The application runs on:
- **Local**: http://localhost:3000
- **Network**: http://0.0.0.0:3000

## 🗺️ Route Structure

```
/                              → Redirects to /home
/home                          → Homepage with hero & featured events

# Authentication
/login                         → User login
/signup                        → User registration
/vendor-login                  → Vendor login

# Events
/events/list                   → Browse all events
/events/details/[eventId]      → Event details page

# Vendors
/vendors/list                  → Browse all vendors

# Bookings
/bookings/checkout             → Booking checkout flow
/bookings/confirmation         → Booking success page

# User Profile
/profile/overview              → User profile & booking history
/profile/settings              → Edit profile settings

# Vendor Portal (Placeholder)
/vendor/dashboard              → Vendor dashboard
/vendor/events/manage          → Manage events
/vendor/events/create          → Create new event
/vendor/bookings               → View bookings
```

## 📱 Responsive Design

### Desktop View (>1024px)
- Top navigation bar with logo and links
- Full-width layouts
- Footer with company information

### Mobile View (<1024px)
- Compact top bar with logo
- Bottom navigation with 4 tabs:
  - 🏠 Home
  - 🎉 Events
  - 🏢 Vendors
  - 👤 Profile
- Touch-optimized UI elements

## 🎨 Design System

### Color Palette

```typescript
// Primary Colors
primary: '#2563EB'      // Blue
secondary: '#8B5CF6'    // Purple
accent: '#EC4899'       // Pink

// Functional Colors
success: '#10B981'      // Green
warning: '#F59E0B'      // Yellow
error: '#EF4444'        // Red

// Neutral Colors
background: '#FFFFFF'   // White
foreground: '#1F2937'   // Gray-900
muted: '#F3F4F6'        // Gray-100
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 600-700
- **Body**: Font weight 400-500

## 🔧 TypeScript Configuration

### Strict Type Checking

The project uses TypeScript with the following configuration:

```json
{
  "compilerOptions": {
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
```

### Path Aliases

```typescript
// Instead of relative imports
import { EventListScreen } from '../../../modules/events/user';

// Use absolute imports
import { EventListScreen } from '@/modules/events/user';
```

Available aliases:
- `@/*` → Root directory
- `@/modules/*` → Modules directory
- `@/demo/*` → Demo data
- `@/domain/*` → Type definitions
- `@/lib/*` → Utilities
- `@/styles/*` → Styles

## 📦 Key Dependencies

### Core
- `next@14.2.3` - React framework
- `react@18` - UI library
- `typescript@5.9.3` - Type safety

### UI & Styling
- `tailwindcss@3.4.1` - Utility-first CSS
- `lucide-react@0.516.0` - Icon library
- `class-variance-authority@0.7.1` - Component variants
- `tailwind-merge@3.3.1` - Merge Tailwind classes

### Form & Validation
- `react-hook-form@7.58.1` - Form management
- `zod@3.25.67` - Schema validation
- `@hookform/resolvers@5.1.1` - Form resolvers

### Database
- `mongodb@6.6.0` - MongoDB driver

### Utilities
- `date-fns@4.1.0` - Date manipulation
- `axios@1.10.0` - HTTP client
- `uuid@9.0.1` - UUID generation

## 🗄️ Demo Data

All demo data is fully typed and located in `/demo/`:

### Events
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  location: string;
  price: number;
  imageUrl: string;
  vendor: Vendor;
}
```

Sample: 6 events across different categories (Music, Sports, Technology, Arts, Food, Business)

### Vendors
```typescript
interface Vendor {
  id: string;
  name: string;
  description: string;
  rating: number;
  eventsCount: number;
  verified: boolean;
  logoUrl: string;
}
```

Sample: 4 verified vendors/organizers

### Bookings
```typescript
interface Booking {
  id: string;
  eventId: string;
  userId: string;
  tickets: number;
  totalPrice: number;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}
```

Sample: 2 booking records

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=your_database_name

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGINS=*
```

## 🧩 Module Documentation

Each module contains its own README.md with specific details:

- [`/modules/auth/README.md`](./modules/auth/README.md) - Authentication screens
- [`/modules/events/README.md`](./modules/events/README.md) - Event browsing & details
- [`/modules/bookings/README.md`](./modules/bookings/README.md) - Booking flow
- [`/modules/vendors/README.md`](./modules/vendors/README.md) - Vendor listings
- [`/modules/profile/README.md`](./modules/profile/README.md) - User profile management
- [`/modules/homepage/README.md`](./modules/homepage/README.md) - Homepage sections
- [`/modules/layouts/README.md`](./modules/layouts/README.md) - Layout components
- [`/modules/common/README.md`](./modules/common/README.md) - Shared components

## 🛠️ Development Guidelines

### File Naming Conventions

- **Components**: PascalCase (e.g., `EventListScreen.tsx`)
- **Files**: Match component names
- **Folders**: kebab-case (e.g., `event-details/`)
- **Types**: PascalCase (e.g., `Event`, `Booking`)
- **Hooks**: camelCase with `use` prefix (e.g., `useIsMobile`)

### Import Order

```typescript
// 1. React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { format } from 'date-fns';

// 3. Internal modules
import { EventListScreen } from '@/modules/events/user';

// 4. Demo data and types
import { demoEvents } from '@/demo';
import { Event } from '@/domain/event';

// 5. Utilities
import { cn } from '@/lib/utils';

// 6. Styles
import './styles.css';
```

### Component Structure

```typescript
'use client'; // Only if client-side features needed

import React from 'react';

interface Props {
  title: string;
  description?: string;
}

export function ComponentName({ title, description }: Props) {
  // Component logic here
  
  return (
    <div className="container">
      {/* JSX here */}
    </div>
  );
}
```

### Type Safety Best Practices

1. **Always define interfaces for props**
   ```typescript
   interface ButtonProps {
     label: string;
     onClick: () => void;
     disabled?: boolean;
   }
   ```

2. **Use type inference when possible**
   ```typescript
   const events = demoEvents; // Type inferred as Event[]
   ```

3. **Avoid `any` type**
   ```typescript
   // Bad
   function handleData(data: any) { }
   
   // Good
   function handleData(data: Event) { }
   ```

4. **Use union types for variants**
   ```typescript
   type Status = 'pending' | 'confirmed' | 'cancelled';
   ```

## 🚀 Future Enhancements

### Authentication & Authorization
- [ ] Supabase authentication integration
- [ ] OAuth providers (Google, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] Protected routes with middleware

### Backend Integration
- [ ] MongoDB CRUD operations
- [ ] RESTful API endpoints
- [ ] Real-time event availability updates
- [ ] Server-side pagination and filtering

### Payment Processing
- [ ] Stripe integration
- [ ] PayPal support
- [ ] Invoice generation
- [ ] Refund management

### Vendor Portal
- [ ] Complete dashboard implementation
- [ ] Event creation and editing
- [ ] Analytics and reporting
- [ ] Booking management

### User Features
- [ ] Advanced search and filtering
- [ ] Event reviews and ratings
- [ ] Wishlist/favorites
- [ ] Event reminders
- [ ] Calendar integration (Google Calendar, iCal)

### Communication
- [ ] Email notifications (SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] In-app messaging
- [ ] Push notifications

### Other
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] PWA capabilities
- [ ] SEO optimization
- [ ] Image optimization with Next.js Image
- [ ] Automated testing (Jest, React Testing Library)

## 📝 Scripts

```bash
# Development
yarn dev                 # Start development server
yarn dev:no-reload      # Start without hot reload
yarn dev:webpack        # Start with webpack

# Production
yarn build              # Build for production
yarn start              # Start production server

# Utilities
yarn lint               # Run ESLint
yarn type-check         # Run TypeScript compiler check
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: Module not found error
```bash
# Clear Next.js cache
rm -rf .next
yarn dev
```

**Issue**: TypeScript errors
```bash
# Check TypeScript configuration
yarn type-check
```

**Issue**: Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the development team.

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**
