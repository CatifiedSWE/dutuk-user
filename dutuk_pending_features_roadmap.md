# Dutuk – Pending Features Roadmap

This roadmap is split into **phases**, ordered by priority, and categorized by **Vendor App** and **User App** for clarity and execution speed.

---

## 🚀 Phase 1 – Core Booking Flow (Highest Priority)
> Blocking issues that directly affect bookings and revenue.

### 📱 Vendor App

#### 1. Date Availability (Make It Functional)
- Replace the currently **hardcoded availability**
- Vendor should be able to:
  - Mark dates as **available / unavailable**
- Availability must be stored in the database
- This availability data will be used to:
  - **Block unavailable dates** on the user booking calendar

---

### 🌐 User App

#### 2. Date Availability in Booking Calendar
- While booking an event:
  - Vendor availability should be **reflected directly in the calendar**
  - Users **must not be able to select** dates where the vendor is unavailable or already booked
- Availability data comes from the vendor app

---

#### 3. Booking Page (Visibility Fix)
- Users can currently book events but **cannot view their bookings**
- Add a booking page where users can:
  - View all past and upcoming bookings
  - See booking status and event details

---

## ⚡ Phase 2 – Vendor Awareness & Realtime Updates
> Ensures vendors don’t miss bookings and can react instantly.

### 📱 Vendor App

#### 4. Realtime Orders Subscription (Bug Fix)
- Supabase realtime channel for **orders** is enabled but not working correctly
- Current logs show:
  - `SUBSCRIBED`
  - followed by `CHANNEL_ERROR`
- This must be fixed so that:
  - Vendors can **instantly see new orders**
  - Realtime updates are reliable

---

#### 5. New Order Indicator (UX Improvement)
- When a new order is created:
  - Show a **red notification indicator** on the orders section
- Helps vendors instantly notice new bookings

---

## ⭐ Phase 3 – Reviews & Trust Layer
> Improves credibility, feedback loop, and platform quality.

### 🔁 Order Lifecycle Logic (Core Rule)
- Each order is tied to an `event_date`
- Logic to determine completion:
  - If **current date > event_date**, the event is considered **completed**
- Behavior changes after completion:
  - Order should be **removed from active orders**
  - Order should be displayed **only in History**

---

### 🌐 User App

#### 6. Reviews System (New Feature)
- Users should be able to **post reviews only after an event is completed**
- Conditions:
  - Review is enabled **only if current date > event_date**
  - User must have a **confirmed booking**
  - Booking must be verified via the **orders table in Supabase**
- Prevents fake, premature, or spam reviews

---

### 📱 Vendor App

#### 7. Reviews Visibility (UX Improvement)
- Current flow to view reviews is:
  - Go to history
  - Open events
  - Manually read reviews (poor UX)
- Add:
  - A **reviews component on the vendor home page**
  - Easy access to latest / recent reviews

---

### 📱 Vendor App

#### 7. Reviews Visibility (UX Improvement)
- Current flow to view reviews is:
  - Go to history
  - Open events
  - Manually read reviews (poor UX)
- Add:
  - A **reviews component on the vendor home page**
  - Easy access to latest / recent reviews

---

## 🧩 Phase 4 – Feature Completion & Polish (Lower Priority)
> Important but not blocking core usage.

### 📱 Vendor App

#### 8. Post Packages (Missing Feature)
- Vendors can currently post **events only**
- Add ability to:
  - Create and manage **packages they provide**
  - Add pricing, details, and package-specific availability

---

#### 9. Portfolio Section (Missing Feature)
- Add a **portfolio module** for vendors
- Vendors should be able to:
  - Upload photos
  - Showcase previous work and completed events
- Improves trust and conversion on the user side

---

## ✅ Execution Notes
- **Phase 1 must be completed first** (everything else depends on it)
- Realtime fixes in Phase 2 unlock better vendor responsiveness
- Reviews should never be implemented without booking verification
- Phase 4 can be parallelized once core flows are stable

