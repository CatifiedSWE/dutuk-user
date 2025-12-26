# Chat Module

## Overview
The Chat module provides a complete messaging interface for users to communicate with vendors and other users on the platform. It follows the modular architecture pattern with screen components orchestrating reusable section components.

## Structure

```
/modules/chat/
├── README.md
└── user/
    ├── ChatScreen.tsx              # Main orchestrator component
    └── sections/
        ├── ChatSidebar.tsx         # Left sidebar with conversation list
        ├── ChatWindow.tsx          # Main chat area with messages
        └── ChatInput.tsx           # Message input with send functionality
```

## Components

### ChatScreen (Main Orchestrator)
- **Location**: `/modules/chat/user/ChatScreen.tsx`
- **Purpose**: Main screen component that orchestrates all chat sections
- **Features**:
  - Manages active conversation state
  - Coordinates between sidebar, window, and input sections
  - Handles background patterns and layout
  - Responsive design with mobile empty state

### ChatSidebar Section
- **Location**: `/modules/chat/user/sections/ChatSidebar.tsx`
- **Purpose**: Left sidebar displaying list of conversations
- **Features**:
  - Search conversations functionality
  - Display conversation previews with avatars
  - Show online/offline/away status indicators
  - Unread message badges
  - Active conversation highlighting
  - Click to select conversation

### ChatWindow Section
- **Location**: `/modules/chat/user/sections/ChatWindow.tsx`
- **Purpose**: Main chat area displaying messages
- **Features**:
  - Display conversation header with user info and status
  - Show message thread with timestamps
  - Support for text messages and file attachments
  - Own messages (right-aligned, primary color background)
  - Received messages (left-aligned, white background)
  - Date dividers
  - Action buttons (voice call, video call, more options)
  - Empty state when no conversation selected

### ChatInput Section
- **Location**: `/modules/chat/user/sections/ChatInput.tsx`
- **Purpose**: Message input area at the bottom
- **Features**:
  - Text input with emoji button
  - Attachment button
  - Send button
  - Form submission handling
  - Auto-clear after send

## Demo Data

### Location
`/demo/chatData.ts`

### Data Structure

#### Conversation Interface
```typescript
interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  status?: 'online' | 'away' | 'offline';
  isActive?: boolean;
}
```

#### Message Interface
```typescript
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  hasFile?: boolean;
  fileName?: string;
  fileSize?: string;
}
```

### Demo Data Includes
- 4 sample conversations with different statuses
- 4 sample messages in the active conversation
- One message with file attachment

## Route Integration

### Page Route
- **Location**: `/app/(user)/chat/page.tsx`
- **URL**: `/chat`
- **Layout**: Includes Header and Footer components

## Design System

### Colors (from HTML reference)
- Primary: `#7C2A2A` (maroon red - from existing design system)
- Primary Light: `#FFF0F0` (light pink background)
- Background: `#FDFBF9` (cream white)
- Message Sent: Primary color with shadow
- Message Received: White with border

### Styling Features
- Custom scrollbar (5px width, rounded)
- Background patterns with gradient blobs
- Glassmorphism effects on chat header
- Shadow effects on messages
- Rounded corners (2xl, 3xl for major containers)
- Smooth transitions and hover effects

### Typography
- Font Family: Poppins (from existing design system)
- Message Text: 15px
- Timestamps: 10-11px
- Headers: Bold, 18-24px

### Spacing
- Container padding: 4-8 units
- Message spacing: 6 units
- Section gaps: 4 units

## Responsive Design

### Desktop (md and above)
- Three-column layout: Sidebar (340-400px) + Chat Window + Input
- All features visible
- Full functionality enabled

### Mobile
- Sidebar takes full width
- Empty state shown for chat window
- User must select conversation (mobile chat view to be implemented in future)

## Navigation

### Header Integration
The Chat link has been added to both:
- Desktop navigation menu
- Mobile hamburger menu

## Future Enhancements

### Functional Features
- [ ] Real-time message updates via WebSocket
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] File upload and download
- [ ] Emoji picker integration
- [ ] Message search
- [ ] Delete/edit messages
- [ ] Message reactions
- [ ] Image/video preview in chat
- [ ] Voice messages

### Mobile Features
- [ ] Full mobile chat view (conversation detail page)
- [ ] Swipe gestures for actions
- [ ] Bottom sheet for file picker

### Backend Integration
- [ ] Connect to Supabase for message storage
- [ ] User authentication integration
- [ ] Message pagination/infinite scroll
- [ ] Push notifications for new messages
- [ ] Online status tracking

## Usage

### Importing the Screen
```typescript
import ChatScreen from '@/modules/chat/user/ChatScreen';
```

### Using in a Page
```typescript
export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header variant="solid" />
      <ChatScreen />
      <Footer />
    </div>
  );
}
```

### Accessing Demo Data
```typescript
import { demoConversations, demoMessages } from '@/demo/chatData';
// or
import { demoConversations, demoMessages } from '@/demo';
```

## Dependencies

### External Packages
- `lucide-react`: Icons (Search, Edit, Phone, Video, etc.)
- `react`: Core React library
- `next`: Next.js framework

### Internal Dependencies
- `/demo/chatData.ts`: Demo conversation and message data
- `/components/Header.tsx`: Page header
- `/components/Footer.tsx`: Page footer
- `/app/globals.css`: Custom scrollbar styles

## Best Practices

1. **State Management**: Currently uses local React state. Consider adding Context API or Zustand for complex state management when integrating with backend.

2. **Type Safety**: All components use TypeScript interfaces for props and data structures.

3. **Modularity**: Each section is a separate component that can be reused or modified independently.

4. **Responsive**: Mobile-first approach with progressive enhancement for larger screens.

5. **Accessibility**: Consider adding ARIA labels and keyboard navigation in future iterations.

## Testing Checklist

- [x] Chat sidebar displays all conversations
- [x] Active conversation is highlighted
- [x] Online status indicators show correctly
- [x] Messages display with correct alignment (own vs received)
- [x] File attachment UI renders correctly
- [x] Message input accepts text
- [x] Send button triggers form submission
- [x] Responsive layout works on mobile
- [x] Header navigation includes Chat link
- [ ] Messages can be sent (requires backend)
- [ ] Real-time updates work (requires WebSocket)

## Notes

- This module currently uses demo/mock data
- The chat functionality is presentational only - actual message sending will require backend integration
- The design closely follows the HTML reference provided while maintaining consistency with the existing project design system
- Color scheme adjusted from original HTML (#8B0000) to match project design system (#7C2A2A)
