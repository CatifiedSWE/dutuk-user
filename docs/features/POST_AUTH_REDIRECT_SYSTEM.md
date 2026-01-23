# Global Post-Authentication Redirect System

## 📋 Overview

A comprehensive, application-wide system that preserves user context during authentication flows. When users trigger authentication from anywhere in the app, they are seamlessly returned to their exact location after signing in.

**Problem Solved:** Users were always redirected to Home after authentication, regardless of where they initiated the auth flow. This caused:
- Loss of user context
- Broken flows (event wizard, booking, checkout)
- Repeated work and user drop-offs
- High UX friction

---

## 🎯 Key Features

✅ **Universal Coverage** - Works across the entire application, not just specific flows  
✅ **Complete State Preservation** - Captures pathname + query params + hash  
✅ **Security Built-in** - Validates internal URLs only, prevents redirect loops  
✅ **Auto-Expiry** - Old redirects expire after 30 minutes  
✅ **Developer-Friendly** - Simple React hook API for easy integration  
✅ **Backward Compatible** - Existing flows continue to work  
✅ **Multiple Auth Methods** - Supports both popup modals and direct navigation  

---

## 🏗️ Architecture

### Core Components

```
/app/lib/utils/authRedirect.ts       # Core utility functions
/app/hooks/useAuthRedirect.ts        # React hook wrapper
/app/components/modals/              # Auth gate modals
/app/modules/auth/screens/           # Login/Signup screens
```

### Data Flow

```
User Action
    ↓
Capture Current Location (pathname + query + hash)
    ↓
Save to localStorage (key: 'dutuk-post-auth-redirect')
    ↓
Redirect to /login or /signup with ?redirect parameter
    ↓
User Completes Authentication
    ↓
Check for redirect (URL param OR localStorage)
    ↓
Redirect to Saved Location
    ↓
Clear Saved Redirect
```

---

## 🔧 Implementation

### 1. Core Utility (`authRedirect.ts`)

```typescript
// Save current location
savePostAuthRedirect(customPath?: string)

// Retrieve saved location
getPostAuthRedirect(): string | null

// Clear after successful redirect
clearPostAuthRedirect()

// Build auth URLs with redirect
buildLoginUrl(customReturnPath?: string): string
buildSignupUrl(customReturnPath?: string): string
```

**Safety Features:**
- ✅ Only accepts relative paths (internal URLs)
- ✅ Blocks auth pages (/login, /signup, /otp, /forgot-password)
- ✅ Auto-expires after 30 minutes
- ✅ Validates paths before saving/using

### 2. React Hook (`useAuthRedirect`)

```typescript
const {
  redirectToLogin,      // Capture location + redirect to login
  redirectToSignup,     // Capture location + redirect to signup
  handlePostAuthRedirect, // Handle redirect after auth
  clearRedirect,        // Manual cleanup
  getSavedRedirect,     // Get saved path
  getCurrentPath        // Get current full path
} = useAuthRedirect();
```

### 3. Usage Examples

#### In Components Requiring Auth

```typescript
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

function BookingButton() {
  const { redirectToLogin } = useAuthRedirect();
  const { isAuthenticated } = useAuth();

  const handleBooking = () => {
    if (!isAuthenticated) {
      // Automatically captures current location and redirects
      redirectToLogin();
      return;
    }
    // Proceed with booking
  };

  return <button onClick={handleBooking}>Book Now</button>;
}
```

#### In Auth Gate Modals

```typescript
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

function AuthGateModal({ open, onOpenChange }) {
  const { redirectToLogin, redirectToSignup } = useAuthRedirect();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <button onClick={() => {
        onOpenChange(false);
        redirectToLogin(); // Captures location automatically
      }}>
        Sign In
      </button>
      <button onClick={() => {
        onOpenChange(false);
        redirectToSignup(); // Captures location automatically
      }}>
        Create Account
      </button>
    </Dialog>
  );
}
```

#### In Login/Signup Screens

```typescript
// LoginScreen.tsx
import { getPostAuthRedirect, clearPostAuthRedirect } from '@/lib/utils/authRedirect';

// After successful login
const redirectUrl = searchParams.get('redirect'); // From URL
const savedRedirect = getPostAuthRedirect();      // From localStorage

if (redirectUrl) {
  clearPostAuthRedirect();
  router.push(redirectUrl);
} else if (savedRedirect) {
  clearPostAuthRedirect();
  router.push(savedRedirect);
} else {
  router.push('/'); // Default fallback
}
```

---

## 📱 Supported Flows

### 1. Event Wizard
- ✅ Multi-step form with progress preservation
- ✅ Returns to exact step after auth
- ✅ All form data preserved via Zustand store

### 2. Booking Flows
- ✅ Vendor booking (Book Now button)
- ✅ Event booking (Check Availability)
- ✅ Service booking
- ✅ Returns to booking modal after auth

### 3. Protected Actions
- ✅ Favorites/Wishlist
- ✅ Reviews
- ✅ Chat/Messages
- ✅ Profile actions

### 4. Navigation Triggers
- ✅ Header "Login / Sign Up" link
- ✅ Mobile profile menu login
- ✅ Auth gate modals
- ✅ Protected route middleware

### 5. Complex URLs
- ✅ Query parameters preserved (`/explore?category=dj&city=chennai`)
- ✅ Hash fragments preserved (`/vendors#reviews`)
- ✅ Multiple query params (`/events?sort=date&filter=upcoming`)

---

## 🔒 Security Features

### 1. URL Validation
```typescript
// Only internal paths allowed
✅ /vendors/profile/123
✅ /explore?category=dj
❌ https://external-site.com
❌ javascript:alert('xss')
```

### 2. Loop Prevention
```typescript
// Auth pages cannot be redirect targets
❌ /login → save → redirect to /login (blocked)
❌ /signup → save → redirect to /signup (blocked)
✅ /vendors → save → redirect to /vendors (allowed)
```

### 3. Expiry System
```typescript
// Redirects expire after 30 minutes
Save: timestamp = Date.now()
Retrieve: if (Date.now() - timestamp > 30min) { clear(); return null; }
```

---

## 🧪 Testing Scenarios

### Test 1: Booking Flow
1. Navigate to `/vendors/profile/123`
2. Click "Book Now" (not authenticated)
3. Click "Sign In" in modal
4. Complete login
5. **Expected:** Return to `/vendors/profile/123` with booking modal open

### Test 2: Event Wizard
1. Fill Event Wizard to Step 3
2. Click "Create Event" (not authenticated)
3. Click "Sign In"
4. Complete login
5. **Expected:** Return to Event Wizard Step 3 with all data intact

### Test 3: Explore with Query Params
1. Navigate to `/explore?category=photography&city=Chennai`
2. Click "Login" in header
3. Complete login
4. **Expected:** Return to `/explore?category=photography&city=Chennai`

### Test 4: Mobile Navigation
1. Open app on mobile
2. Tap profile icon
3. Tap "Login / Sign Up"
4. Complete login
5. **Expected:** Return to original page

### Test 5: Redirect Expiry
1. Trigger auth redirect
2. Wait 31 minutes
3. Complete login
4. **Expected:** Redirect to Home (expired redirect cleared)

### Test 6: Loop Prevention
1. Navigate to `/login` directly
2. Attempt to save as redirect
3. **Expected:** Redirect not saved (auth page blocked)

---

## 📊 Console Logging

For debugging, the system logs:

```javascript
// When saving redirect
📍 Saved post-auth redirect: /vendors/profile/123?tab=reviews

// When retrieving redirect
✅ Retrieved post-auth redirect: /vendors/profile/123?tab=reviews

// When clearing redirect
🧹 Cleared post-auth redirect

// When validation fails
⚠️ Invalid redirect path, not saving: /login
```

---

## 🔄 Migration from Old System

### Old (Wizard-Specific)
```typescript
import { saveWizardReturnPath } from '@/lib/utils/wizardRedirect';
saveWizardReturnPath('/events/plan', 5);
```

### New (Universal)
```typescript
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
const { redirectToLogin } = useAuthRedirect();
redirectToLogin(); // Automatically captures current location
```

**Backward Compatibility:** Old `wizardRedirect.ts` still works for existing Event Wizard flow.

---

## 🚀 Adding to New Components

### Step 1: Import Hook
```typescript
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
```

### Step 2: Use in Component
```typescript
function MyProtectedComponent() {
  const { isAuthenticated } = useAuth();
  const { redirectToLogin } = useAuthRedirect();

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    // Your protected logic
  };
}
```

### That's it! 🎉
The hook automatically:
- ✅ Captures current location
- ✅ Saves to localStorage
- ✅ Redirects to login
- ✅ Cleans up after redirect

---

## 🐛 Troubleshooting

### Issue: Redirect not working
**Check:**
1. Is the path valid? (must start with `/`)
2. Is it an auth page? (blocked by design)
3. Has it expired? (>30 minutes old)
4. Check console logs for validation errors

### Issue: Redirecting to Home instead of saved location
**Check:**
1. LoginScreen is checking both URL param and localStorage
2. clearPostAuthRedirect() is called after redirect
3. Saved redirect hasn't expired

### Issue: Redirect loop
**This is prevented by design.**  
Auth pages (/login, /signup) cannot be saved as redirects.

---

## 📝 File Reference

### Created Files
- `/app/lib/utils/authRedirect.ts` - Core utility (150 lines)
- `/app/hooks/useAuthRedirect.ts` - React hook (60 lines)
- `/app/docs/features/POST_AUTH_REDIRECT_SYSTEM.md` - This documentation

### Modified Files
- `/app/components/modals/AuthGateModal.tsx`
- `/app/components/modals/AuthRequiredModal.tsx`
- `/app/components/Header.tsx`
- `/app/components/mobile/MobileProfileMenu.tsx`
- `/app/modules/auth/screens/LoginScreen.tsx`
- `/app/modules/auth/screens/SignupScreen.tsx`

---

## 📞 Support

For questions or issues:
1. Check console logs (emoji indicators)
2. Verify localStorage: `localStorage.getItem('dutuk-post-auth-redirect')`
3. Check redirect timestamp: `localStorage.getItem('dutuk-redirect-timestamp')`
4. Review excluded paths in `authRedirect.ts`

---

**Status:** ✅ Implemented  
**Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Main Agent  
**Testing:** Ready for QA
