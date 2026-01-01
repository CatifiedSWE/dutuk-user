# Auth Flow Visual Guide

## Complete Authentication & Onboarding Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Landing Page │
│   /home      │
└──────┬───────┘
       │
       ├─── Not Logged In ────┐
       │                      │
       │                  ┌───▼────┐
       │                  │ Signup │──────┐
       │                  │ /signup│      │
       │                  └────────┘      │
       │                                  │
       │                  ┌────────┐      │
       │                  │ Login  │──────┤
       │                  │ /login │      │
       │                  └────────┘      │
       │                                  │
       │                          ┌───────▼────────┐
       │                          │ Enter Email    │
       │                          │ OTP Sent       │
       │                          └───────┬────────┘
       │                                  │
       │                          ┌───────▼────────┐
       │                          │ OTP Verify     │
       │                          │ /otp           │
       │                          └───────┬────────┘
       │                                  │
       │                        ┌─────────┴─────────┐
       │                        │                   │
       │                 New User                Existing User
       │                        │                   │
       │                        │          ┌────────▼─────────┐
       │                        │          │ Check Onboarding │
       │                        │          │ Status (DB)      │
       │                        │          └────────┬─────────┘
       │                        │                   │
       │                        │          ┌────────┴─────────┐
       │                        │          │                  │
       │                        │    Complete            Incomplete
       │                        │          │                  │
       │          ┌─────────────▼──────────▼──────────────────┘
       │          │
       │    ┌─────▼──────┐
       │    │ Onboarding │
       │    │   Flow     │
       │    └─────┬──────┘
       │          │
       │    ┌─────▼──────────┐
       │    │ Name Setup     │
       │    │ /onboarding/   │
       │    │ name           │
       │    └─────┬──────────┘
       │          │
       │    ┌─────▼──────────┐
       │    │ Location Setup │
       │    │ /onboarding/   │
       │    │ location       │
       │    └─────┬──────────┘
       │          │
       │    ┌─────▼──────────┐
       │    │ Photo Upload   │
       │    │ /onboarding/   │
       │    │ photo (Skip?)  │
       │    └─────┬──────────┘
       │          │
       └──────────┴───────────┐
                              │
                    ┌─────────▼─────────┐
                    │ Home (Logged In)  │
                    │ Full Access       │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
       ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
       │ Events      │ │ Vendors   │ │ Profile     │
       │ /events/*   │ │ /vendors/*│ │ /profile/*  │
       └─────────────┘ └───────────┘ └─────────────┘
              │               │               │
       ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
       │ Bookings    │ │ Chat      │ │ Explore     │
       │ /bookings/* │ │ /chat     │ │ /explore    │
       └─────────────┘ └───────────┘ └─────────────┘
```

---

## Middleware Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MIDDLEWARE LOGIC FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │ New Request  │
                          └──────┬───────┘
                                 │
                          ┌──────▼────────┐
                          │ Update Session│
                          │ (Supabase SSR)│
                          └──────┬────────┘
                                 │
                          ┌──────▼────────┐
                          │ Get User Auth │
                          │ Status        │
                          └──────┬────────┘
                                 │
                      ┌──────────┴──────────┐
                      │                     │
              Is Authenticated?            No
                      │                     │
                     Yes            ┌───────▼────────┐
                      │             │ Public Route?  │
                      │             └───────┬────────┘
                      │                     │
                      │              ┌──────┴──────┐
                      │             Yes           No
                      │              │             │
                      │         ┌────▼────┐  ┌────▼────────┐
                      │         │ Allow   │  │ Redirect to │
                      │         │ Access  │  │ /login      │
                      │         └─────────┘  └─────────────┘
                      │
              ┌───────▼────────┐
              │ Check Route    │
              │ Type           │
              └───────┬────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   Auth Route?   Onboarding    Protected
        │          Route?          Route?
        │             │             │
       Yes            │            No
        │             │             │
   ┌────▼─────┐      │        ┌────▼────────┐
   │ Query DB │      │        │ Query DB    │
   │ Check    │      │        │ Check       │
   │ Onboard  │      │        │ Onboard     │
   └────┬─────┘      │        └────┬────────┘
        │            │              │
   ┌────┴─────┐     │         ┌────┴────┐
   │          │     │         │         │
Complete  Incomplete│    Complete  Incomplete
   │          │     │         │         │
   │          │     │         │         │
┌──▼──┐  ┌───▼──┐  │    ┌────▼────┐ ┌─▼────────┐
│Redir│  │Redir │  │    │ Allow   │ │ Redirect │
│/home│  │/onb/ │  │    │ Access  │ │ /onb/name│
│     │  │name  │  │    │         │ │          │
└─────┘  └──────┘  │    └─────────┘ └──────────┘
                   │
           ┌───────▼────────┐
           │ Check Onboard  │
           │ Complete?      │
           └───────┬────────┘
                   │
           ┌───────┴────────┐
           │                │
       Complete         Incomplete
           │                │
    ┌──────▼──────┐  ┌──────▼──────┐
    │ Redirect to │  │ Allow Access│
    │ /home       │  │ to Onboard  │
    └─────────────┘  └─────────────┘
```

---

## Onboarding Completion Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING COMPLETION CHECK                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │ Query Database   │
                    │ customer_profiles│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ SELECT full_name,│
                    │ city FROM        │
                    │ customer_profiles│
                    │ WHERE user_id=?  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Has full_name?   │
                    └────────┬─────────┘
                             │
                      ┌──────┴──────┐
                     Yes            No
                      │              │
             ┌────────▼────────┐    │
             │ Has city?       │    │
             └────────┬────────┘    │
                      │             │
               ┌──────┴──────┐      │
              Yes           No      │
               │              │     │
        ┌──────▼──────┐      │     │
        │ COMPLETE    │      │     │
        │ ✅          │      │     │
        └─────────────┘      │     │
                             │     │
                      ┌──────▼─────▼──────┐
                      │ INCOMPLETE        │
                      │ ❌                │
                      └───────────────────┘

Note: profile_photo_url is OPTIONAL and not checked
```

---

## Route Access Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROUTE ACCESS RULES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Route                    │ Not Authed │ Authed+Incomplete │ Authed+Complete
─────────────────────────┼────────────┼───────────────────┼─────────────────
/home                    │ ✅ Allow   │ ✅ Allow          │ ✅ Allow
/login                   │ ✅ Allow   │ → /onboarding/name│ → /home
/signup                  │ ✅ Allow   │ → /onboarding/name│ → /home
/otp                     │ ✅ Allow   │ ✅ Allow          │ ✅ Allow
/forgot-password         │ ✅ Allow   │ ✅ Allow          │ ✅ Allow
/vendor-login            │ ✅ Allow   │ → /onboarding/name│ → /home
─────────────────────────┼────────────┼───────────────────┼─────────────────
/onboarding/name         │ → /login   │ ✅ Allow          │ → /home
/onboarding/location     │ → /login   │ ✅ Allow          │ → /home
/onboarding/photo        │ → /login   │ ✅ Allow          │ → /home
─────────────────────────┼────────────┼───────────────────┼─────────────────
/events/*                │ → /login   │ → /onboarding/name│ ✅ Allow
/vendors/*               │ → /login   │ → /onboarding/name│ ✅ Allow
/bookings/*              │ → /login   │ → /onboarding/name│ ✅ Allow
/profile/*               │ → /login   │ → /onboarding/name│ ✅ Allow
/chat                    │ → /login   │ → /onboarding/name│ ✅ Allow
/explore                 │ → /login   │ → /onboarding/name│ ✅ Allow
─────────────────────────┼────────────┼───────────────────┼─────────────────
/                        │ → /home    │ → /onboarding/name│ → /home

Legend:
✅ Allow     = Direct access granted
→ /path      = Redirect to specified path
```

---

## Database Schema for Auth

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         customer_profiles TABLE                              │
└─────────────────────────────────────────────────────────────────────────────┘

Column               Type        Required  Used In Onboarding Check
────────────────────────────────────────────────────────────────────────────
user_id              UUID        Yes       User identifier (PK)
email                TEXT        Yes       User email
full_name            TEXT        No        ✅ CHECKED (required)
phone                TEXT        No        Not checked
address              TEXT        No        Not checked
city                 TEXT        No        ✅ CHECKED (required)
state                TEXT        No        Not checked
postal_code          TEXT        No        Not checked
country              TEXT        No        Not checked
profile_photo_url    TEXT        No        Not checked (optional)
created_at           TIMESTAMP   Yes       Auto-generated
updated_at           TIMESTAMP   Yes       Auto-updated

Onboarding Complete When:
✅ full_name IS NOT NULL AND city IS NOT NULL
```

---

## Session Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SESSION MANAGEMENT                                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. User Signs Up/Logs In
   │
   ├─→ Supabase Auth creates session
   │
   ├─→ Session stored in HTTP-only cookies
   │
   └─→ Access token + Refresh token issued

2. Middleware on Each Request
   │
   ├─→ Reads cookies
   │
   ├─→ Calls supabase.auth.getUser()
   │
   ├─→ Validates access token
   │
   ├─→ Auto-refreshes if expired
   │
   └─→ Returns user object or null

3. Session Expiry
   │
   ├─→ Access token: 1 hour
   │
   ├─→ Refresh token: 30 days
   │
   └─→ Auto-refresh happens in middleware

4. Sign Out
   │
   ├─→ User clicks logout
   │
   ├─→ Calls supabase.auth.signOut()
   │
   ├─→ Clears all cookies
   │
   └─→ Middleware redirects to /login
```

---

## Error Handling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ERROR SCENARIOS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Scenario                          Middleware Behavior
────────────────────────────────────────────────────────────────────────────
Session expired                   → Auto-refresh via updateSession()
User deleted from Supabase        → Treat as not authenticated
Database query fails              → Treat onboarding as incomplete (safe)
Invalid cookies                   → Treat as not authenticated
Network error                     → Allow request through (fail open)
Profile not found                 → Treat onboarding as incomplete

Security Note: Middleware fails open (allows access) on errors to prevent
breaking the entire site. RLS policies provide the final security layer.
```

---

**Implementation Complete:** January 2025  
**Status:** All routing guards active and functional ✅
