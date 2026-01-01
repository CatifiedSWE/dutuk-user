# 💬 Chat Functionality Implementation Checklist

## 📋 Project Overview
**Feature:** Real-time chat messaging between Customers and Vendors  
**Tech Stack:** Supabase (PostgreSQL + Realtime) + Next.js  
**Last Updated:** January 2025

---

## 🎯 Requirements Summary

### Core Features
- [x] Replace dummy chat data with real Supabase integration
- [ ] Terms & Conditions alert on first message
- [ ] Contact information blocking/filtering
- [ ] Real-time message delivery
- [ ] Conversation persistence
- [ ] Post-booking contact sharing (after payment)

### Business Rules
1. **T&C Enforcement**: Users must accept terms before chatting with vendors
2. **Contact Blocking**: No contact info sharing until payment is completed
3. **Payment Gate**: Contact sharing unlocked after customer pays platform
4. **Dispute Protection**: Platform holds payment until service completion

---

## 📊 Implementation Phases

### ✅ Phase 0: Planning & Documentation
- [x] Create chat-function-checklist.md
- [x] Define database schema requirements
- [x] Clarify business rules with stakeholder
- [x] Plan contact filtering patterns

**Status:** ✅ COMPLETED  
**Date Completed:** January 2025

---

### ⏳ Phase 1: Database Schema Setup

#### 1.1 Create Conversations Table
- [ ] Create SQL migration file `09_create_conversations_table.sql`
- [ ] Define table structure:
  - [ ] id (UUID, Primary Key)
  - [ ] customer_id (UUID, references auth.users)
  - [ ] vendor_id (UUID, references auth.users)
  - [ ] terms_accepted_by_customer (BOOLEAN)
  - [ ] terms_accepted_at (TIMESTAMP)
  - [ ] payment_completed (BOOLEAN) - For contact sharing gate
  - [ ] booking_id (UUID, references bookings/events)
  - [ ] last_message_at (TIMESTAMP)
  - [ ] created_at, updated_at (TIMESTAMP)
- [ ] Add indexes for fast queries
- [ ] Add unique constraint (customer_id + vendor_id)
- [ ] Test table creation in Supabase

#### 1.2 Create Messages Table
- [ ] Create SQL migration file (or extend 09)
- [ ] Define table structure:
  - [ ] id (UUID, Primary Key)
  - [ ] conversation_id (UUID, references conversations)
  - [ ] sender_id (UUID, references auth.users)
  - [ ] receiver_id (UUID, references auth.users)
  - [ ] message_text (TEXT)
  - [ ] has_attachment (BOOLEAN)
  - [ ] attachment_url (TEXT)
  - [ ] attachment_name (TEXT)
  - [ ] attachment_size (TEXT)
  - [ ] is_read (BOOLEAN)
  - [ ] read_at (TIMESTAMP)
  - [ ] created_at (TIMESTAMP)
- [ ] Add indexes (conversation_id, sender_id, created_at)
- [ ] Add trigger for updating conversations.last_message_at
- [ ] Test table creation in Supabase

#### 1.3 Row Level Security (RLS) Policies
- [ ] Create RLS policy file `10_create_rls_for_chat_tables.sql`
- [ ] Conversations policies:
  - [ ] Users can only see their own conversations
  - [ ] Users can create conversations
  - [ ] Users cannot delete other's conversations
- [ ] Messages policies:
  - [ ] Users can only see messages in their conversations
  - [ ] Users can insert messages they send
  - [ ] Users cannot delete other's messages
  - [ ] Users can update read status on received messages
- [ ] Test RLS policies with different user roles

**Status:** ⏳ NOT STARTED  
**Blocker:** None  
**ETA:** TBD

---

### ⏳ Phase 2: Contact Information Filtering

#### 2.1 Create Contact Detection Utility
- [ ] Create `/lib/utils/contactInfoFilter.ts`
- [ ] Implement regex patterns for:
  - [ ] Phone numbers (US, international formats)
  - [ ] Email addresses
  - [ ] URLs/websites
  - [ ] Social media handles (@username)
  - [ ] WhatsApp/Telegram mentions
  - [ ] Facebook/Instagram profile links
- [ ] Create detection function `containsContactInfo(text: string)`
- [ ] Create extraction function `extractContactInfo(text: string)` for debugging

#### 2.2 Implement Filter Logic
- [ ] Add validation before sending message
- [ ] Return specific error messages:
  - [ ] "Phone numbers cannot be shared in chat"
  - [ ] "Email addresses cannot be shared in chat"
  - [ ] "Website links cannot be shared in chat"
  - [ ] "Social media handles cannot be shared in chat"
- [ ] Add exception for post-payment conversations
- [ ] Create unit tests for filter patterns

#### 2.3 Payment Gate Override
- [ ] Check `conversation.payment_completed` flag
- [ ] Allow contact info if payment is done
- [ ] Show badge/indicator in UI when contact sharing is allowed
- [ ] Update filter to bypass checks for paid conversations

**Status:** ⏳ NOT STARTED  
**Dependencies:** Phase 1 (Database)  
**ETA:** TBD

---

### ⏳ Phase 3: Terms & Conditions Alert

#### 3.1 Create T&C Modal Component
- [ ] Create `/modules/chat/user/components/TermsConditionsModal.tsx`
- [ ] Design modal UI matching screenshot:
  - [ ] Warning icon (yellow/amber)
  - [ ] Title: "Terms & Conditions Alert"
  - [ ] Message: "According to Dutuk Terms and Conditions your not allowed to share your any kindly of contact information like phone number, email, etc through chat or call"
  - [ ] Link: "Read our Terms & Conditions" (placeholder URL)
  - [ ] Accept button (primary style)
  - [ ] Decline button (secondary style)
  - [ ] Close icon (X)

#### 3.2 Implement Modal Logic
- [ ] Show modal when:
  - [ ] User sends first message in conversation
  - [ ] terms_accepted_by_customer is false/null
- [ ] Accept button action:
  - [ ] Update conversation record: terms_accepted = true
  - [ ] Send the pending message
  - [ ] Close modal
  - [ ] Never show again for this conversation
- [ ] Decline button action:
  - [ ] Discard the message
  - [ ] Close modal
  - [ ] Redirect to vendor profile page
- [ ] Close icon: Same as decline

#### 3.3 Integration with Chat Flow
- [ ] Add T&C check in ChatInput component
- [ ] Queue message until T&C accepted
- [ ] Handle modal state in ChatScreen
- [ ] Add loading state during acceptance
- [ ] Test full flow: first message → modal → accept → send

**Status:** ⏳ NOT STARTED  
**Dependencies:** Phase 1 (Database)  
**ETA:** TBD

---

### ⏳ Phase 4: Supabase Integration & Real-Time

#### 4.1 Create Data Hooks
- [ ] Create `/hooks/useConversations.ts`:
  - [ ] `useConversations()` - Fetch user's conversations
  - [ ] `useConversation(id)` - Get single conversation
  - [ ] `useCreateConversation()` - Start new conversation
  - [ ] Include vendor/customer profile data in joins
- [ ] Create `/hooks/useMessages.ts`:
  - [ ] `useMessages(conversationId)` - Fetch messages
  - [ ] `useSendMessage()` - Send new message
  - [ ] `useMarkAsRead()` - Mark messages as read
  - [ ] Handle file attachments

#### 4.2 Real-Time Subscriptions
- [ ] Implement Supabase Realtime for messages:
  - [ ] Subscribe to INSERT events on messages table
  - [ ] Filter by conversation_id
  - [ ] Auto-append new messages to UI
- [ ] Implement Realtime for conversations:
  - [ ] Subscribe to UPDATE events
  - [ ] Update last_message and timestamps
  - [ ] Update unread counts
- [ ] Handle subscription cleanup on unmount
- [ ] Test real-time with two browser windows

#### 4.3 Replace Dummy Data
- [ ] Update `ChatScreen.tsx`:
  - [ ] Replace `demoConversations` with `useConversations()`
  - [ ] Replace `messagesMap` with `useMessages()`
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Add empty states
- [ ] Update `ChatSidebar.tsx`:
  - [ ] Use real conversation data
  - [ ] Calculate unread counts from database
  - [ ] Show real last message time
- [ ] Update `ChatWindow.tsx`:
  - [ ] Display real messages
  - [ ] Show sender/receiver correctly
  - [ ] Handle attachments from database
- [ ] Update `ChatInput.tsx`:
  - [ ] Send messages to database
  - [ ] Add contact filter validation
  - [ ] Show loading during send
  - [ ] Handle errors

#### 4.4 UI Polish
- [ ] Add loading skeletons for conversations
- [ ] Add loading skeletons for messages
- [ ] Show "No conversations yet" empty state
- [ ] Show "No messages yet" in conversation
- [ ] Add error toasts for failed operations
- [ ] Add success feedback on message sent

**Status:** ⏳ NOT STARTED  
**Dependencies:** Phase 1, 2, 3  
**ETA:** TBD

---

### ⏳ Phase 5: Testing & Quality Assurance

#### 5.1 Unit Testing
- [ ] Test contact filter patterns (all formats)
- [ ] Test T&C modal logic
- [ ] Test data hooks (CRUD operations)
- [ ] Test payment gate logic

#### 5.2 Integration Testing
- [ ] Test complete message flow: compose → validate → T&C → send → receive
- [ ] Test conversation creation flow
- [ ] Test real-time updates between users
- [ ] Test contact blocking scenarios
- [ ] Test payment gate override

#### 5.3 User Acceptance Testing
- [ ] Test as customer sending first message
- [ ] Test accepting T&C
- [ ] Test declining T&C (redirect)
- [ ] Test contact info blocking (all types)
- [ ] Test normal messaging after T&C accepted
- [ ] Test post-payment contact sharing
- [ ] Test on mobile responsive view

#### 5.4 Edge Cases
- [ ] Multiple conversations with same vendor
- [ ] Rapid message sending
- [ ] Network interruptions
- [ ] Large attachments
- [ ] Special characters in messages
- [ ] Emoji support

**Status:** ⏳ NOT STARTED  
**Dependencies:** Phase 4  
**ETA:** TBD

---

### 🔮 Phase 6: Future Enhancements (Post-MVP)

#### On Hold Features
- [ ] Conversation initiation from vendor profile (depends on other feature)
- [ ] Search conversations functionality
- [ ] Message edit/delete functionality
- [ ] Typing indicators
- [ ] Online/offline status (real-time presence)
- [ ] Push notifications for new messages
- [ ] Message reactions
- [ ] Image/video sharing
- [ ] Voice messages
- [ ] Read receipts UI

**Status:** 🔮 FUTURE  
**Priority:** Post-MVP

---

## 📝 Technical Notes

### Database Design Decisions
- **Conversations Table**: Stores metadata + T&C acceptance state
- **Messages Table**: Stores individual messages with read tracking
- **Payment Gate**: `payment_completed` flag enables contact sharing
- **Booking Link**: Optional `booking_id` to link conversation to booking

### Contact Filter Patterns
```javascript
// Regex patterns to implement
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|io)[^\s]*)/g;
const SOCIAL_PATTERN = /@[a-zA-Z0-9_]{3,}/g;
const WHATSAPP_PATTERN = /whatsapp|wa\.me|watsapp/gi;
```

### Security Considerations
- RLS policies prevent unauthorized access
- Contact filter runs client-side AND should be validated server-side
- Payment status verified before allowing contact sharing
- Terms acceptance timestamp for audit trail

### Performance Optimizations
- Index on (conversation_id, created_at) for fast message queries
- Index on (customer_id, vendor_id) for conversation lookup
- Limit initial message load to last 50 messages
- Implement infinite scroll for message history

---

## 🐛 Known Issues & Blockers

### Current Blockers
1. **Conversation Initiation Feature**: On hold pending other feature implementation
2. **T&C Page**: Not created yet, using placeholder link

### Issues to Monitor
- None currently

---

## ✅ Acceptance Criteria

### Must Have (MVP)
- [x] Chat UI exists with dummy data ✅
- [ ] Database tables created and working
- [ ] T&C modal shows on first message
- [ ] Contact info is blocked with clear error
- [ ] Messages persist in database
- [ ] Real-time updates work
- [ ] Payment gate allows contact sharing

### Nice to Have (Future)
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Online status
- [ ] Push notifications

---

## 📊 Progress Summary

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 0: Planning | ✅ Complete | 100% | Checklist created |
| Phase 1: Database | ⏳ Not Started | 0% | Ready to begin |
| Phase 2: Contact Filter | ⏳ Not Started | 0% | Depends on Phase 1 |
| Phase 3: T&C Modal | ⏳ Not Started | 0% | Depends on Phase 1 |
| Phase 4: Integration | ⏳ Not Started | 0% | Depends on 1-3 |
| Phase 5: Testing | ⏳ Not Started | 0% | Depends on Phase 4 |

**Overall Progress:** 16% (Phase 0 Complete)

---

## 🔄 Change Log

| Date | Phase | Change | Author |
|------|-------|--------|--------|
| 2025-01-XX | Phase 0 | Created initial checklist | Main Agent |

---

## 📞 Stakeholder Decisions Log

### Decision 1: T&C Link Behavior
- **Date:** 2025-01-XX
- **Decision:** Make clickable but use placeholder URL until T&C page is created
- **Rationale:** T&C page not ready yet

### Decision 2: Contact Blocking Behavior
- **Date:** 2025-01-XX
- **Decision:** Show error message and prevent sending (vs. masking)
- **Rationale:** Clear feedback to users about policy

### Decision 3: Conversation Initiation
- **Date:** 2025-01-XX
- **Decision:** Put on hold pending other feature
- **Rationale:** Another feature needs implementation first

### Decision 4: Post-Payment Contact Sharing
- **Date:** 2025-01-XX
- **Decision:** Allow after payment to platform (intermediary model)
- **Rationale:** Platform holds payment, releases after service or refunds on dispute

---

## 🎯 Next Steps

1. **Immediate:** Create SQL migration files for conversations and messages tables
2. **Then:** Implement contact filter utility with comprehensive patterns
3. **Then:** Build T&C modal component
4. **Then:** Create data hooks and replace dummy data
5. **Finally:** Test complete flow end-to-end

**Current Task:** Phase 1.1 - Create Conversations Table

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Document Version:** 1.0
