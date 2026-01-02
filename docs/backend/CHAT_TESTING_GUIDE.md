# 🧪 Chat Functionality Testing Guide

## 📋 Overview

This guide provides step-by-step instructions for testing the chat functionality after SQL migrations have been executed in Supabase.

**Prerequisites:**
- ✅ SQL migrations `09_create_chat_tables.sql` and `10_create_rls_for_chat_tables.sql` must be executed in Supabase
- ✅ Application must be running locally or deployed
- ✅ At least 2 user accounts (1 customer + 1 vendor) for testing

---

## 🔧 Setup Instructions

### Step 1: Execute SQL Migrations

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Execute the following files in order:
   - `/sql-migrations/09_create_chat_tables.sql`
   - `/sql-migrations/10_create_rls_for_chat_tables.sql`
4. Verify tables were created:
   ```sql
   SELECT * FROM public.conversations LIMIT 1;
   SELECT * FROM public.messages LIMIT 1;
   ```

### Step 2: Create Test Accounts

You need at least 2 accounts for testing:

**Account 1: Customer**
- Role: Customer
- Purpose: Send messages to vendors
- Must have completed onboarding

**Account 2: Vendor**
- Role: Vendor
- Purpose: Receive and respond to messages
- Must have a vendor profile (company)

### Step 3: Verify Environment Variables

Check that `.env.local` has correct Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## ✅ Test Scenarios

### Test 1: First Message & Terms Acceptance

**Objective:** Verify T&C modal appears on first message and terms are saved

**Steps:**
1. Log in as **Customer** account
2. Navigate to Chat page (`/chat`)
3. Click on a vendor conversation (or create one if none exist)
4. Type a message: "Hi, I'm interested in your services"
5. Click Send

**Expected Results:**
- ✅ Terms & Conditions modal should appear
- ✅ Modal should show warning icon and message about not sharing contact info
- ✅ "Accept & Continue" and "Decline" buttons should be visible

**Test Accept Flow:**
6. Click "Accept & Continue"

**Expected Results:**
- ✅ Modal closes
- ✅ Message is sent
- ✅ Message appears in chat window
- ✅ Database: `conversations.terms_accepted_by_customer` = true
- ✅ Database: `conversations.terms_accepted_at` has timestamp

**Test Decline Flow:**
7. (Alternative) Click "Decline"

**Expected Results:**
- ✅ Modal closes
- ✅ Message is NOT sent
- ✅ User remains on chat page (or optionally redirected)

---

### Test 2: Contact Information Blocking

**Objective:** Verify contact info cannot be shared before payment

**Prerequisites:**
- Customer has accepted T&C
- Payment NOT completed (`payment_completed` = false)

**Test Cases:**

#### Test 2.1: Phone Number
**Input:** "Call me at 555-123-4567"  
**Expected:** ❌ Error: "Phone numbers cannot be shared in chat until payment is completed"

#### Test 2.2: Email Address
**Input:** "Email me at john@example.com"  
**Expected:** ❌ Error: "Email addresses cannot be shared in chat until payment is completed"

#### Test 2.3: Website URL
**Input:** "Check out my website https://example.com"  
**Expected:** ❌ Error: "Website links cannot be shared in chat until payment is completed"

#### Test 2.4: Social Media
**Input:** "Follow me @johndoe on Instagram"  
**Expected:** ❌ Error: "Social media profiles and handles cannot be shared until payment is completed"

#### Test 2.5: Messaging Apps
**Input:** "Message me on WhatsApp"  
**Expected:** ❌ Error: "References to external messaging apps are not allowed"

#### Test 2.6: Bypass Attempts
**Input:** "Just call me later"  
**Expected:** ❌ Error: "Please do not attempt to share contact information"

#### Test 2.7: Normal Message
**Input:** "What is your availability for next weekend?"  
**Expected:** ✅ Message sends successfully

---

### Test 3: Payment Gate Override

**Objective:** Verify contact sharing is allowed after payment

**Setup:**
1. In Supabase SQL Editor, simulate payment completion:
   ```sql
   UPDATE public.conversations 
   SET 
     payment_completed = true,
     payment_completed_at = NOW()
   WHERE id = 'conversation-id-here';
   ```

**Steps:**
2. Refresh the chat page
3. Look for green badge: "✓ Payment completed - You can now share contact information"
4. Try sending contact info: "My phone is 555-123-4567"

**Expected Results:**
- ✅ Green payment badge is visible
- ✅ Message with phone number sends successfully
- ✅ No error appears
- ✅ Contact info filter is bypassed

---

### Test 4: Real-Time Messaging

**Objective:** Verify messages appear instantly for both users

**Setup:**
- Open 2 browser windows (or 1 normal + 1 incognito)
- Window 1: Customer account
- Window 2: Vendor account
- Both on same conversation

**Steps:**
1. In Window 1 (Customer), send message: "Hello from customer"
2. Watch Window 2 (Vendor)

**Expected Results:**
- ✅ Message appears instantly in Window 2 without refresh
- ✅ Unread count increases in Window 2 sidebar
- ✅ Last message preview updates in sidebar

3. In Window 2 (Vendor), send reply: "Hello from vendor"
4. Watch Window 1 (Customer)

**Expected Results:**
- ✅ Reply appears instantly in Window 1 without refresh
- ✅ Auto-scrolls to bottom
- ✅ Message marked as read automatically

---

### Test 5: Unread Message Counts

**Objective:** Verify unread counts are accurate

**Steps:**
1. Log in as **Vendor** account
2. Navigate to another page (not chat)
3. In another window, log in as **Customer**
4. Customer sends 3 messages to vendor
5. Go back to Vendor account
6. Navigate to Chat page

**Expected Results:**
- ✅ Sidebar shows unread badge with count "3"
- ✅ Conversation is highlighted/bolded
- ✅ When vendor clicks conversation, unread count resets to 0
- ✅ Messages are marked as read in database

---

### Test 6: Multiple Conversations

**Objective:** Verify chat works with multiple conversations

**Steps:**
1. Create conversations with 3 different vendors
2. Send messages to each
3. Switch between conversations

**Expected Results:**
- ✅ Each conversation maintains its own message history
- ✅ Switching conversations loads correct messages
- ✅ Last message preview is accurate for each
- ✅ Timestamps are correctly formatted
- ✅ Active conversation is highlighted

---

### Test 7: Empty States

**Objective:** Verify empty states display correctly

**Test 7.1: No Conversations**
**Steps:**
1. Create fresh user account
2. Navigate to Chat page

**Expected Results:**
- ✅ Shows "No Conversations Yet" message
- ✅ Shows "Browse Vendors" button
- ✅ Button links to `/explore` page

**Test 7.2: No Messages in Conversation**
**Steps:**
1. Create new conversation (no messages sent)
2. Open conversation

**Expected Results:**
- ✅ Shows empty chat window
- ✅ Shows placeholder or "No messages yet" text
- ✅ Input field is functional

---

### Test 8: Loading States

**Objective:** Verify loading indicators work

**Steps:**
1. Navigate to Chat page
2. Observe loading behavior
3. Send a message
4. Observe sending state

**Expected Results:**
- ✅ Loading spinner shows while fetching conversations
- ✅ Skeleton loaders for conversation list (if implemented)
- ✅ Send button shows loading state while sending
- ✅ Input is disabled during send
- ✅ Message appears after successful send

---

### Test 9: Mobile Responsiveness

**Objective:** Verify chat works on mobile screens

**Steps:**
1. Open browser DevTools
2. Switch to mobile view (iPhone/Android size)
3. Navigate to Chat page
4. Test all functionality

**Expected Results:**
- ✅ Sidebar shows first (full screen)
- ✅ Clicking conversation opens chat window (hides sidebar)
- ✅ Back button appears in header
- ✅ Back button returns to sidebar
- ✅ Messages are readable and properly formatted
- ✅ Input works with mobile keyboard
- ✅ Send button is easily tappable

---

### Test 10: Error Handling

**Objective:** Verify errors are handled gracefully

**Test 10.1: Network Error**
**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try sending message

**Expected Results:**
- ✅ Error message appears
- ✅ Message not lost
- ✅ User can retry
- ✅ No crash

**Test 10.2: Invalid Data**
**Steps:**
1. Manually trigger API error (e.g., invalid conversation ID)

**Expected Results:**
- ✅ Error message displayed
- ✅ Option to retry or return
- ✅ Application doesn't crash

---

## 🐛 Common Issues & Solutions

### Issue 1: "Table does not exist"
**Cause:** SQL migrations not executed  
**Solution:** Execute migrations in Supabase SQL Editor

### Issue 2: "Permission denied"
**Cause:** RLS policies not set up correctly  
**Solution:** Execute `10_create_rls_for_chat_tables.sql`

### Issue 3: Messages not appearing in real-time
**Cause:** Realtime not enabled  
**Solution:** Check Supabase Realtime is enabled for conversations/messages tables

### Issue 4: Contact filter not working
**Cause:** Payment flag not checked  
**Solution:** Verify `payment_completed` flag in conversation

### Issue 5: T&C modal always appears
**Cause:** `terms_accepted_by_customer` not saved  
**Solution:** Check database write permissions and RLS policies

---

## 📝 Database Verification Queries

### Check Conversations
```sql
SELECT 
  id,
  customer_id,
  vendor_id,
  terms_accepted_by_customer,
  payment_completed,
  last_message_at,
  last_message_preview
FROM public.conversations
ORDER BY last_message_at DESC;
```

### Check Messages
```sql
SELECT 
  id,
  conversation_id,
  sender_id,
  message_text,
  is_read,
  created_at
FROM public.messages
ORDER BY created_at DESC
LIMIT 20;
```

### Check Unread Counts
```sql
SELECT * FROM get_unread_count('user-id-here');
```

### Verify RLS Policies
```sql
SELECT * FROM pg_policies 
WHERE tablename IN ('conversations', 'messages');
```

---

## ✅ Acceptance Criteria Checklist

After completing all tests, verify:

- [ ] T&C modal appears on first message
- [ ] T&C acceptance is saved to database
- [ ] Contact info blocking works for all types
- [ ] Payment gate allows contact sharing
- [ ] Messages send and receive in real-time
- [ ] Unread counts are accurate
- [ ] Multiple conversations work independently
- [ ] Empty states display correctly
- [ ] Loading states appear appropriately
- [ ] Mobile UI is fully functional
- [ ] Errors are handled gracefully
- [ ] All database queries work correctly

---

## 🎯 Next Steps After Testing

1. **If all tests pass:**
   - Mark Phase 5 as complete in checklist
   - Document any issues found
   - Consider additional features (file upload, typing indicators, etc.)

2. **If issues found:**
   - Document issues in checklist under "Known Issues"
   - Prioritize fixes (critical vs. nice-to-have)
   - Re-test after fixes

3. **Production deployment:**
   - Execute SQL migrations in production Supabase
   - Test with real users
   - Monitor Supabase logs for errors
   - Set up monitoring/alerts

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** Development Team
