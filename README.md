# Dutuk - Event Management Platform

A modern event management and booking platform built with Next.js 16, featuring a modular architecture, complete authentication flow, and real-time database integration.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (Email OTP + Google OAuth)
- **Package Manager**: npm

---

## 📁 Project Structure

```
/app/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes (home)
│   ├── (auth)/                  # Auth routes (login, signup, otp)
│   ├── (user)/                  # User portal (events, vendors, profile, chat, explore)
│   ├── (vendor)/                # Vendor portal (placeholder)
│   ├── layout.tsx               # Root layout
│   └── middleware.ts            # Route protection
│
├── modules/                     # Feature modules
│   ├── auth/                    # Authentication screens
│   ├── events/                  # Event browsing & management
│   ├── vendors/                 # Vendor profiles & listings
│   ├── bookings/                # Booking flow (placeholder)
│   ├── chat/                    # Chat/messaging interface
│   ├── explore/                 # Unified search & discovery
│   ├── profile/                 # User profile management
│   ├── homepage/                # Homepage sections
│   └── layouts/                 # Layout components
│
├── components/                  # Shared UI components
│   └── ui/                     # Reusable components
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Auth state management
│   ├── useVendors.ts           # Vendors data fetching
│   ├── useVendorServices.ts    # Services data fetching
│   └── ...                     # Other data hooks
│
├── lib/                         # Utilities & libraries
│   ├── auth/                   # Authentication module
│   └── supabase/               # Supabase client
│
├── domain/                      # TypeScript interfaces
│   ├── event.ts
│   ├── vendor.ts
│   └── user.ts
│
├── demo/                        # Mock data (deprecated)
└── docs/                        # Documentation
    ├── backend/                # Backend architecture docs
    ├── flow/                   # Auth & user flow docs
    ├── summary/                # Implementation summaries
    └── completion/             # Phase completion reports
```

---

## 🏗️ Architecture Pattern

The project follows a **Module → Hook → Database** architecture:

### 1. **Modules** (`/modules/`)
Self-contained feature modules with screens and business logic:
- Fully typed with TypeScript
- Contains module-specific README.md
- Exports components via barrel exports
- Follows feature-first organization

### 2. **Custom Hooks** (`/hooks/`)
React hooks for data fetching and state management:
- Direct Supabase client integration
- Loading states and error handling
- TypeScript interfaces for all data
- Reusable across modules

### 3. **Database** (Supabase)
PostgreSQL database with Row Level Security:
- 14 tables for full feature support
- Comprehensive RLS policies
- Database triggers and functions
- Real-time subscriptions ready

---

## ✨ Features

### ✅ Authentication System (Fully Integrated)

- **Email OTP**: Passwordless signup and login
- **Google OAuth**: One-click authentication
- **Onboarding Flow**: Multi-step profile setup (name → location → photo)
- **Session Management**: Automatic token refresh
- **Password Reset**: Email-based recovery
- **Route Guards**: Middleware-based protection

### ✅ User Portal (Fully Functional)

**Homepage**
- Hero section with video background
- Event categories (DJ, Photography, Decoration, etc.)
- Vendor listings with tabbed navigation
- Bundle services showcase
- Premium event planning section
- Newsletter subscription

**Events Page**
- Browse events with category tabs
- Search and filter functionality
- Premium events section
- Real-time Supabase integration

**Explore Page**
- Unified search (vendors, packages, events)
- Advanced filtering
- Type badges (VENDOR/PACKAGE/EVENT)
- Premium listings

**Vendor Profiles**
- Dynamic vendor pages
- Portfolio showcase (Photos/Videos/Events)
- Customer reviews
- Social media links
- Book Now and Message CTAs

**Chat/Messages**
- WhatsApp-style interface
- Conversation list with search
- Real-time message display
- Status indicators (online/offline/away)
- Mobile-responsive design

**Profile Management**
- View and edit profile
- Booking history
- Saved favorites
- Account settings

### ✅ Backend Integration (Completed)

- 14 database tables configured
- Row Level Security policies active
- Custom React hooks for data operations
- Real-time authentication state
- Error handling and loading states
- Environment-based configuration

### 🚧 Vendor Portal (Database Ready)

- Dashboard (UI pending)
- Event management (schema ready)
- Booking requests (ready for UI)
- Earnings tracking (ready for UI)
- Availability calendar (ready for UI)

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with migrations executed

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🗺️ Key Routes

```
/                              → Redirects to /home
/home                          → Homepage
/login                         → User login
/signup                        → User registration
/otp                           → OTP verification
/onboarding/name               → Onboarding: Name setup
/onboarding/location           → Onboarding: Location setup
/onboarding/photo              → Onboarding: Photo upload
/explore                       → Unified search & discovery
/events/list                   → Browse events
/events/details/[eventId]      → Event details
/vendors/profile/[vendorId]    → Vendor profile
/chat                          → Chat/Messages
/profile/overview              → User profile
/profile/settings              → Profile settings
```

---

## 📱 Responsive Design

### Desktop (>1024px)
- Top navigation bar with full menu
- Multi-column layouts
- Hover effects and animations

### Mobile (<1024px)
- Hamburger menu
- Single-column layouts
- Touch-optimized UI
- Bottom navigation (if enabled)

---

## 🎨 Design System

### Colors
```css
Primary: #7C2A2A (Maroon)
Secondary: #FFC13C (Gold)
Background: #FDF5E6 (Cream)
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Poppins / Urbanist (sans-serif)

---

## 🔐 Authentication

### User Flows

**New User:**
1. Sign up with email → Receive OTP
2. Verify OTP → Create profile
3. Complete onboarding (name, location, photo)
4. Redirect to homepage

**Returning User:**
1. Login with email → Receive OTP
2. Verify OTP → Check onboarding status
3. Complete onboarding (if incomplete) OR go to homepage

**Protected Routes:**
- Unauthenticated users → Redirect to `/login`
- Incomplete onboarding → Redirect to `/onboarding/name`
- Complete profile → Access granted

---

## 📚 Documentation

- **[Backend Architecture](./docs/backend/architecture.md)** - Complete database schema and API documentation
- **[Module READMEs](./modules/)** - Feature-specific documentation
- **[Backend Integration Summary](./docs/backend/BACKEND_INTEGRATION_SUMMARY.md)** - Integration progress
- **[Auth Flow Implementation](./docs/flow/AUTH_FLOW_IMPLEMENTATION.md)** - Authentication details
- **[Phase Completion Reports](./docs/completion/)** - Development milestones

---

## 🛠️ Development

### File Naming
- Components: `PascalCase` (e.g., `EventListScreen.tsx`)
- Files: Match component names
- Folders: `kebab-case`
- Hooks: `camelCase` with `use` prefix

### Import Order
```typescript
// 1. React/Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { format } from 'date-fns';

// 3. Internal modules
import { EventListScreen } from '@/modules/events/user';

// 4. Hooks and utilities
import { useVendors } from '@/hooks/useVendors';
import { cn } from '@/lib/utils';

// 5. Types
import { Event } from '@/domain/event';
```

---

## 🔧 Key Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Supabase (if using CLI)
supabase start             # Start local Supabase
supabase db reset          # Reset database
supabase migration new     # Create migration

# Cache management
rm -rf .next               # Clear Next.js cache
npm run type-check         # Check TypeScript errors
```

---

## 🐛 Troubleshooting

**Module not found:**
```bash
rm -rf .next && npm run dev
```

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Supabase connection error:**
- Verify `.env.local` credentials
- Check Supabase project status
- Verify RLS policies are enabled

**Authentication not working:**
- Clear browser cookies
- Check Supabase Auth settings
- Verify callback URLs

---

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: January 2025

**Completion:**
- Frontend UI: 85% ✅
- Backend Integration: 70% ✅
- Authentication: 100% ✅
- User Features: 60% 🔄
- Vendor Features: 30% 🔄

---

## 📞 Support

For detailed technical information:
- Check `/docs/backend/architecture.md` for database details
- Review module-specific READMEs in `/modules/`
- See `/docs/` for implementation guides

---

**Built with ❤️ using Next.js 16, TypeScript, Tailwind CSS, and Supabase**
