# Guest vs Authenticated Home Page Comparison

## Quick Reference Guide

This document provides a side-by-side comparison of the guest and authenticated home page experiences.

---

## Layout Structure

### Guest User Home Page
```
┌─────────────────────────────────────────┐
│  Header (Login / Sign Up visible)       │
├─────────────────────────────────────────┤
│  🎥 Hero Section (Video Background)     │
│  - Large heading                         │
│  - Subtitle                              │
│  - Search bar                            │
│  - Action buttons (Vendors/Events/Pkgs) │
├─────────────────────────────────────────┤
│  📋 Event Categories                     │
│  - 5 circular categories                 │
│  - Family, Governance, Surprise, etc.    │
├─────────────────────────────────────────┤
│  👥 Vendor Categories                    │
│  - Tabs: Discover, DJ, Photography, etc.│
│  - Filter button                         │
│  - 6 vendor cards in grid                │
├─────────────────────────────────────────┤
│  📦 Bundle Services                      │
│  - Horizontal carousel                   │
│  - 4 service bundles                     │
├─────────────────────────────────────────┤
│  🎁 Premium Packages Banner              │
│  - Full-width background image           │
│  - CTA buttons                           │
├─────────────────────────────────────────┤
│  ⭐ Premium Event Planning               │
│  - Premium vendor cards                  │
│  - Yellow premium badges                 │
└─────────────────────────────────────────┘
```

### Authenticated User Home Page
```
┌─────────────────────────────────────────┐
│  Header (Profile & Logout visible)      │
├─────────────────────────────────────────┤
│  👋 Personalized Hero                    │
│  - Welcome Back badge                    │
│  - "Good Morning, Alex"                  │
│  - Personalized subtitle                 │
│  - Simplified search bar                 │
├─────────────────────────────────────────┤
│  📂 Browse Categories (4 only)           │
│  - Venues | Catering | Photo | Decor    │
│  - Icon-based grid                       │
│  - See All link                          │
├─────────────────────────────────────────┤
│  ✨ Featured Collections                 │
│  - Horizontal carousel with arrows       │
│  - Summer Wedding / Corporate / Birthday │
│  - Pricing & badges                      │
├─────────────────────────────────────────┤
│  ⭐ Top Rated Near You                   │
│  - 3 top-rated vendor cards              │
│  - Star ratings visible                  │
│  - View Details CTA                      │
└─────────────────────────────────────────┘
```

---

## Key Differences

| Feature | Guest User | Authenticated User |
|---------|-----------|-------------------|
| **Hero Section** | Video background, dramatic | Personalized greeting, simple |
| **Greeting** | Generic heading | "Good Morning/Afternoon/Evening, [Name]" |
| **Search Bar** | With action buttons | Simplified, no buttons |
| **Categories** | Full event categories (5+) | Simplified 4 categories |
| **Vendor Section** | Vendor Categories with tabs | Top Rated Near You (3 vendors) |
| **Bundle Services** | Shown | Not shown |
| **Premium Banner** | Shown | Not shown |
| **Premium Planning** | Shown | Not shown |
| **Featured Collections** | Not shown | Shown (carousel) |
| **Personalization** | None | User name, time-based greeting |
| **Header Actions** | Login / Sign Up | Profile & Logout |

---

## Section-by-Section Comparison

### Hero Section

#### Guest
- **Background**: Video loop with dark overlay
- **Main Heading**: "Let's make your next celebration unforgettable."
- **Subtitle**: "Explore work from the most talented and accomplished designers..."
- **Search Bar**: Large, with maroon search button
- **Action Buttons**: 
  - Vendors (white, primary)
  - Events (transparent)
  - Packages (transparent)

#### Authenticated
- **Background**: Gradient background (cream tones)
- **Badge**: 👋 WELCOME BACK
- **Main Heading**: "Good Morning, Alex" (time-based)
- **Subtitle**: "Ready to plan your next big event? Discover top-rated vendors..."
- **Search Bar**: Simple, with "Search" button
- **Action Buttons**: None

---

### Categories Section

#### Guest: "Event categories"
- **Count**: 5 categories
- **Display**: Circular cards with images
- **Categories**: Family, Governance, Surprise, Colleges, Shoot
- **Layout**: Horizontal scrollable row

#### Authenticated: "Browse Categories"
- **Count**: 4 categories
- **Display**: Square cards with gradient icons
- **Categories**: Venues, Catering, Photo, Decor
- **Layout**: 2x2 grid (responsive)
- **Icons**: Building, Utensils, Camera, Flower
- **Link**: "See All" to /explore

---

### Vendor/Top Rated Section

#### Guest: "Discover Vendors"
- **Tabs**: Discover, DJ, Photography, Videography, Decoration, Catering
- **Filter Button**: Present
- **Cards**: 6 vendors in 3-column grid
- **Info**: Name, Location, Rating
- **Hover**: "Check Availability" button overlay

#### Authenticated: "Top Rated Near You"
- **Tabs**: None
- **Filter Button**: None
- **Cards**: 3 vendors in 3-column grid
- **Info**: Name, Location, Rating, Price Range
- **CTA**: "View Details" button (always visible)
- **Link**: "View All" to /explore

---

### Unique Sections

#### Guest Only
1. **Bundle Services**
   - Horizontal carousel
   - 4 service bundles
   - Navigation arrows
   - "View All Bundles" link

2. **Premium Packages Banner**
   - Full-width image
   - "Ready to create something extraordinary?"
   - "View Premium" and "Get Started" buttons

3. **Premium Event Planning**
   - Premium vendor cards
   - Yellow "PREMIUM" badges
   - Crown icon header

#### Authenticated Only
1. **Featured Collections**
   - Horizontal carousel
   - 3 curated packages:
     - Summer Wedding ($1,500+)
     - Business Retreats (15% off)
     - Birthday Celebrations ($800+)
   - Trending/Corporate badges
   - Navigation arrows
   - Full-page images

---

## Visual Design Comparison

### Colors

| Element | Guest | Authenticated |
|---------|-------|--------------|
| Hero Background | Dark video overlay | Light gradient (cream) |
| Primary Text | White (on video) | Dark maroon (#4F0000) |
| Accent Color | Maroon & Gold | Maroon & Gold |
| Cards | White with shadows | White with shadows |
| Buttons | Maroon gradient | Maroon gradient |

### Typography

| Element | Guest | Authenticated |
|---------|-------|--------------|
| Hero Heading | Playfair Display 72px | Playfair Display 60px |
| Greeting | N/A | Playfair Display 48-60px |
| Section Titles | Playfair Display | Playfair Display |
| Body Text | Urbanist/Poppins | Urbanist/Poppins |

### Spacing

| Section | Guest | Authenticated |
|---------|-------|--------------|
| Hero Height | 700-800px | 320-400px |
| Section Gaps | 64-128px | 48-80px |
| Card Padding | 16-24px | 24-32px |

---

## User Journey Comparison

### Guest User Journey
1. **Land on home page**
   - See dramatic video hero
   - Browse all categories and vendors
   - Click on vendor/event card
   - View details
2. **Want to book**
   - Click "Book Now"
   - Redirected to login
3. **After login**
   - Redirected to authenticated home page
   - See personalized greeting

### Authenticated User Journey
1. **Land on home page**
   - See personalized greeting
   - View curated collections
   - Browse top-rated vendors
2. **Quick actions**
   - Search directly
   - Click category to filter
   - View featured packages
3. **Book vendor**
   - Click "Book Now"
   - See booking modal (already authenticated)
   - Complete booking

---

## Component Loading

### Guest Home Page
```
Loading Order:
1. Header
2. Hero Video (poster → video)
3. Event Categories
4. Vendor Categories (Supabase query)
5. Bundle Services
6. Premium Packages Banner
7. Premium Event Planning (Supabase query)
8. Footer
```

### Authenticated Home Page
```
Loading Order:
1. Auth Check (300ms transition)
2. Header (with Profile button)
3. Authenticated Hero (profile fetch)
4. Browse Categories (instant)
5. Featured Collections (instant)
6. Top Rated Near You (Supabase query)
7. Footer
```

---

## Performance Comparison

| Metric | Guest | Authenticated |
|--------|-------|--------------|
| **Initial Load** | ~3-4s (video) | ~2-3s (no video) |
| **Time to Interactive** | ~4s | ~3s |
| **Bundle Size** | Base + Video | Base + Auth |
| **API Calls** | 2 (vendors, categories) | 2 (profile, vendors) |
| **Images** | ~15-20 | ~10-12 |

---

## Accessibility

Both layouts maintain:
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Reduced motion support
- ✅ Color contrast ratios (WCAG AA)

---

## Mobile Responsiveness

### Guest (Mobile)
- Hero: Full height with video
- Categories: Horizontal scroll
- Vendors: 1-2 columns
- All sections visible

### Authenticated (Mobile)
- Hero: Compact height
- Categories: 2x2 grid
- Collections: Horizontal scroll
- Top Rated: Single column

---

## Summary of Changes

### Additions (Authenticated Only)
- ✅ Personalized greeting with time detection
- ✅ User name from profile
- ✅ Simplified 4-category grid
- ✅ Featured Collections carousel
- ✅ Top Rated vendors section

### Removals (Guest Only)
- ❌ Video hero background
- ❌ Action buttons on hero
- ❌ Full event categories
- ❌ Vendor category tabs
- ❌ Bundle Services section
- ❌ Premium Packages Banner
- ❌ Premium Event Planning section

### Maintained (Both)
- ✅ Search functionality
- ✅ Vendor cards design
- ✅ Navigation header
- ✅ Footer
- ✅ Color scheme
- ✅ Typography system

---

## Testing Checklist

### Guest Layout
- [ ] Video hero plays smoothly
- [ ] All 5 event categories display
- [ ] Vendor tabs switch correctly
- [ ] Bundle Services carousel scrolls
- [ ] Premium banner shows
- [ ] Premium vendors display with badges
- [ ] "Login / Sign Up" link works

### Authenticated Layout
- [ ] Greeting shows correct time of day
- [ ] User name displays from profile
- [ ] Search bar works
- [ ] All 4 categories link to explore
- [ ] Featured Collections carousel scrolls
- [ ] Top 3 vendors display with ratings
- [ ] "Profile" and "Logout" buttons work
- [ ] Smooth transition from guest layout

---

**Document Version**: 1.0
**Last Updated**: January 2, 2025
**Status**: Implementation Complete
