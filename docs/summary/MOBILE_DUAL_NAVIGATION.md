# Mobile Dual Navigation System

## Overview

The Dutuk event planning app implements a **dual navigation system** for mobile devices (screens < 1024px), providing an intuitive and modern mobile experience with two distinct navigation bars.

---

## Architecture

### Two-Tier Navigation Structure

1. **Top Navigation Bar** (`MobileTopNav.tsx`)
   - Fixed at the top of the screen
   - Displays branding and utility actions

2. **Bottom Navigation Bar** (`MobileBottomNav.tsx`)
   - Fixed at the bottom of the screen
   - Primary navigation between main app sections

---

## Top Navigation Bar

**Location**: `/app/components/mobile/MobileTopNav.tsx`

### Layout
```
[Logo]                    [Notification] [Profile]
```

### Components
- **Left Side**: Dutuk logo (maroon colored) - links to home
- **Right Side**: 
  - Notification bell icon with red badge indicator
  - Profile avatar (gradient background when authenticated, gray when not)

### Features
- Triggers `MobileProfileMenu` modal when profile icon is clicked
- Auth-aware styling (authenticated users get maroon gradient avatar)
- Notification badge shows active alerts

---

## Bottom Navigation Bar

**Location**: `/app/components/mobile/MobileBottomNav.tsx`

### Navigation Items
1. **Home** - `/home`
2. **Explore** - `/explore`
3. **Chat** - `/chat`

### Active State Design
- **Icon Color**: Maroon (#7C2A2A) when active, gray when inactive
- **Text Color**: Maroon (#7C2A2A) bold when active, gray when inactive
- **Stroke Weight**: Increased (2.5) for active icons
- **No Background Color**: Clean, minimal design with color-only indication

### Implementation
Uses Next.js `usePathname()` hook to automatically detect current route and apply active state styling.

---

## Profile Menu Modal

**Location**: `/app/components/mobile/MobileProfileMenu.tsx`

### Design Features
- Slides up from bottom with smooth spring animation
- Backdrop blur effect for focus
- Drag handle at top for affordance
- Close button (X) in top-right corner

### Content (Authenticated Users)
- **Gradient User Card**: Maroon gradient background with avatar and user info
- **Menu Items**: 
  - My Profile (with chevron indicator)
  - Settings (with chevron indicator)
- **Logout Button**: Red-themed with hover effects

### Content (Guest Users)
- **Welcome Message**: "Welcome to Dutuk!"
- **Description**: Brief explanation of sign-in benefits
- **Login/Sign Up Button**: Prominent maroon gradient CTA with icon
- **Extra Bottom Padding**: Ensures button is fully visible above bottom navigation

### Animations
- Backdrop: Fade in/out with blur
- Modal: Slide up/down with spring physics
- Button: Active scale effect on press

---

## Layout Integration

**Location**: `/app/components/layouts/MainLayout.tsx`

### Responsive Behavior

**Desktop (≥1024px)**:
- Shows standard `Header` component with full navigation
- No mobile navigation bars

**Mobile (<1024px)**:
- Hides desktop `Header`
- Shows `MobileTopNav` (fixed top)
- Shows `MobileBottomNav` (fixed bottom)
- Adds padding to content area: `pt-16` (top), `pb-20` (bottom)

### Usage
All main app pages wrap content in `MainLayout`:
```jsx
<MainLayout>
  {/* Page content */}
</MainLayout>
```

---

## Design System

### Colors
- **Primary**: `#7C2A2A` (Maroon) - Active states, branding
- **Secondary**: `#FFC13C` (Gold) - Accents
- **Background**: White (`#FFFFFF`)
- **Inactive**: Gray shades (`gray-400`, `gray-500`)

### Spacing
- Top bar height: ~60px
- Bottom bar height: ~72px
- Content padding: 16px top, 20px bottom

### Typography
- Font family: Poppins, Urbanist (sans-serif)
- Active labels: Bold/Semibold
- Inactive labels: Medium weight

---

## File Structure

```
/app/components/
├── mobile/
│   ├── MobileTopNav.tsx        # Top navigation bar
│   ├── MobileBottomNav.tsx     # Bottom navigation bar
│   └── MobileProfileMenu.tsx   # Profile modal
└── layouts/
    └── MainLayout.tsx          # Layout wrapper with responsive logic
```

---

## Key Benefits

1. **Ergonomic**: Navigation items are easily reachable with thumbs
2. **Persistent**: Both bars remain fixed during scroll
3. **Intuitive**: Standard mobile UI pattern users expect
4. **Auth-Aware**: Profile menu adapts based on login state
5. **Touch-Optimized**: Large touch targets, smooth animations
6. **Clean Design**: Minimal styling with clear active states

---

## Future Enhancements

- Add more navigation items to bottom bar (e.g., Bookings, Profile)
- Implement notification center when bell icon is tapped
- Add haptic feedback on navigation changes
- Support for badge counts on Chat icon
- Gesture-based navigation (swipe between sections)

---

**Last Updated**: January 2025
