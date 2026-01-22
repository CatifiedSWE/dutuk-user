# Project Details: Dutuk Ecosystem

This document provides an overview of the technical details for the Dutuk startup's applications: **Dutuk User** (Web App) and **Dutuk Vendor** (Mobile App).

---

## 1. Dutuk User (dutuk-user)
**Directory:** `dutuk-user`

**Overview:**
The user-facing web application for Dutuk, built with Next.js 16 and React 19. It serves as the primary interface for users to interact with the platform.

### Tech Stack

- **Framework:** [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** Turbo / Webpack

### Styling & UI
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Primitives:** [Radix UI](https://www.radix-ui.com/) (Extensive use of primitives like Dialog, Dropdown, Navigation Menu, etc.)
- **Animations:** framer-motion, tailwindcss-animate
- **Icons:** Lucide React
- **Utils:** clsx, tailwind-merge, class-variance-authority (cva)

### State & Forms
- **Forms:** React Hook Form
- **Validation:** Zod
- **Resolvers:** `@hookform/resolvers`

### Backend & Data
- **Backend:** [Supabase](https://supabase.com/)
- **Client:** `@supabase/supabase-js`, `@supabase/ssr`

### Other Key Dependencies
- **Date Handling:** `date-fns`
- **Charts:** Recharts
- **Carousel:** Embla Carousel
- **Toasts:** Sonner, `@radix-ui/react-toast`
- **OTP:** `input-otp`

### Scripts
- `dev`: Starts dev server with custom memory limit (`next dev`).
- `build`: Production build (`next build`).
- `start`: Runs production server (`next start`).

---

## 2. Dutuk Vendor (dutuk-vendor)
**Directory:** `dutuk-vendor`

**Overview:**
The mobile application for vendors, built with React Native and Expo. It allows vendors to manage their services and interactions on the platform.

### Tech Stack

- **Framework:** [React Native 0.81.5](https://reactnative.dev/)
- **Platform:** [Expo SDK 54](https://expo.dev/)
- **Router:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Language:** TypeScript

### UI & UX
- **Icons:** `@expo/vector-icons`, `react-native-feather`, `react-native-vector-icons`
- **SVG:** `react-native-svg`
- **Animations:** `react-native-reanimated`
- **Toasts:** `react-native-toast-message`
- **Web View:** `react-native-webview`
- **Calendars:** `react-native-calendars`

### Backend & Data
- **Backend:** Supabase (`@supabase/supabase-js`)
- **Local Storage:** `@react-native-async-storage/async-storage`

### Key Features & Utils
- **Image Picker:** `expo-image-picker`
- **Image Manipulation:** `expo-image-manipulator`
- **Chat:** `react-native-gifted-chat`
- **Authentication:** `react-native-confirmation-code-field` (for OTP/input)

### Scripts
- `start`: Start Expo dev server (`expo start`).
- `android`: Run on Android (`expo run:android`).
- `ios`: Run on iOS (`expo run:ios`).
- `build:apk`: Build APK with EAS (`eas build ...`).

---

## Shared Infrastructure
Both applications share the same backend infrastructure provided by **Supabase**, ensuring data synchronization and consistency across the user and vendor platforms.
