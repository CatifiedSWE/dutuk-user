# 🔐 Auth Flow Implementation Plan

## Overview
Implementing complete authentication and onboarding flow for Dutuk marketplace using Supabase Auth.

---

## Implementation Phases

### Phase 1: Authentication Module
- Email OTP authentication (Supabase Magic Links)
- Google OAuth integration
- Password reset functionality
- Update `/lib/auth/customer-auth.ts`

### Phase 2: Auth Screens
- **SignupScreen**: Email → Send OTP
- **LoginScreen**: Email OTP or Google
- **OTPVerificationScreen**: Verify OTP → Session → Onboarding
- **ResetPasswordLinkSentScreen**: New page (copy OTP design)

### Phase 3: Onboarding Screens
- **NameSetupScreen**: Save name to `customer_profiles`
- **LocationSetupScreen**: Save location to `customer_profiles`
- **PhotoUploadScreen**: Optional (skippable)

### Phase 4: Routing Guards (proxy.ts)
- Unauthenticated → `/login`
- Authenticated + incomplete onboarding → `/onboarding/name`
- Complete → `/home`
- Infer completion from DB (name + location exist)

### Phase 5: Testing
- Email OTP flow
- Google OAuth flow
- Password reset flow
- Onboarding completion
- Routing guards

---

## Technical Notes
- Using Supabase Auth OTP (no passwords)
- No client-side validation
- No `onboarding_completed` boolean
- Google OAuth via Supabase providers
- Routing guards in `proxy.ts` (not middleware.ts)

---

**Status:** Implementation In Progress
**Date:** 2025
