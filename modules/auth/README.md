# Auth Module

Authentication screens and components with elegant, professional UI design.

## Screens

### LoginScreen
- **Route**: `/login`
- **Features**: 
  - Username and password inputs with Material Icons
  - Remember me checkbox
  - Forgot password link
  - Google login integration
  - Sign up link
- **Design**: Two-column layout with decorative left panel (branding) and login form on right

### SignupScreen
- **Route**: `/signup`
- **Features**: 
  - Username and password inputs with Material Icons
  - Remember me checkbox
  - Forgot password link
  - Google signup integration
  - Login link for existing users
- **Design**: Matching layout with LoginScreen for consistent experience

### OtpVerificationScreen
- **Route**: `/otp`
- **Features**: 
  - 6-digit OTP input fields with auto-focus
  - Masked email display (alex******@example.com)
  - Countdown timer (04:59)
  - Resend code button with refresh animation
- **Design**: Two-column layout with "Secure Verification" branding

## Design System

### Colors
- Primary: `#8B0000` (Dark Red/Maroon)
- Primary Hover: `#660000`
- Background: `#F9FAFB`
- Input Background: `#F3F4F6`
- Text: `#111827`
- Muted Text: `#6B7280`

### Typography
- Display Font: Playfair Display (headings)
- Body Font: Inter (forms and content)
- Material Icons for all UI icons

### Effects
- Glassmorphism with backdrop blur
- Rotating card animations on hover
- Gradient backgrounds with blur overlays
- Smooth transitions and shadow effects

## File Structure

```
/modules/auth/screens/
├── LoginScreen.tsx           # User login page
├── SignupScreen.tsx          # User registration page
├── OtpVerificationScreen.tsx # OTP verification page
└── index.ts                  # Barrel export
```

## Routes

All authentication routes are in the `(auth)` route group:

```
/app/(auth)/
├── login/page.tsx   → LoginScreen
├── signup/page.tsx  → SignupScreen
└── otp/page.tsx     → OtpVerificationScreen
```

## Usage

```tsx
// Import screens
import { LoginScreen, SignupScreen, OtpVerificationScreen } from '@/modules/auth/screens';

// Use in pages
export default function LoginPage() {
    return <LoginScreen />;
}
```

## Note

Currently using placeholder UI implementations with no backend integration or form validation. These are pure frontend components ready for future API integration with Supabase or other authentication services.
