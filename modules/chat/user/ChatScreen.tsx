'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ChatSidebar from './sections/ChatSidebar';
import ChatWindow from './sections/ChatWindow';
import ChatInput from './sections/ChatInput';
import AddChatModal from './sections/AddChatModal';
import { demoConversations, demoMessages, Conversation, Message } from '@/demo/chatData';

// Initialize messages for each conversation with proper demo data
const initializeMessagesMap = (): Record<string, Message[]> => {
  // Demo messages for different conversations to show variety
  const messagesForConv2: Message[] = [
    {
      id: 'msg-2-1',
      senderId: '2',
      text: 'Hi! I wanted to check if you received the event photos?',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: 'msg-2-2',
      senderId: 'me',
      text: 'Yes, I got them! They look amazing. Thanks so much!',
      timestamp: '10:35 AM',
      isOwn: true,
    },
    {
      id: 'msg-2-3',
      senderId: '2',
      text: 'Perfect, thanks for the info!',
      timestamp: '10:42 AM',
      isOwn: false,
    },
  ];

  const messagesForConv3: Message[] = [
    {
      id: 'msg-3-1',
      senderId: '3',
      text: 'Hey, quick question about the schedule',
      timestamp: 'Yesterday',
      isOwn: false,
    },
    {
      id: 'msg-3-2',
      senderId: 'me',
      text: 'Sure, what do you need to know?',
      timestamp: 'Yesterday',
      isOwn: true,
    },
    {
      id: 'msg-3-3',
      senderId: '3',
      text: 'Are we still on for the meeting?',
      timestamp: 'Yesterday',
      isOwn: false,
    },
  ];

  const messagesForConv4: Message[] = [
    {
      id: 'msg-4-1',
      senderId: 'me',
      text: 'Can you check the vendor availability for next month?',
      timestamp: 'Mon',
      isOwn: true,
    },
    {
      id: 'msg-4-2',
      senderId: '4',
      text: 'Let me check the schedule.',
      timestamp: 'Mon',
      isOwn: false,
    },
  ];

  return {
    '1': demoMessages,
    '2': messagesForConv2,
    '3': messagesForConv3,
    '4': messagesForConv4,
  };
};

export default function ChatScreen() {
  // Active conversation state
  const [activeConversationId, setActiveConversationId] = useState('1');
  
  // Mobile view state - tracks if we're viewing chat window or sidebar on mobile
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // All conversations state
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  
  // Messages organized by conversation ID - initialized with proper demo data
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initializeMessagesMap);
  
  // Modal state
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = messagesMap[activeConversationId] || [];
  
  // Memoized conversations with synced last messages from actual message data
  const syncedConversations = useMemo(() => {
    return conversations.map(conv => {
      const messages = messagesMap[conv.id] || [];
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        return {
          ...conv,
          lastMessage: lastMsg.text.length > 40 ? lastMsg.text.slice(0, 40) + '...' : lastMsg.text,
        };
      }
      return conv;
    });
  }, [conversations, messagesMap]);

  // Handle conversation selection
  const handleConversationSelect = useCallback((id: string) => {
    setActiveConversationId(id);
    
    // Update conversations to mark selected as active and clear unread
    setConversations(prev => prev.map(conv => ({
      ...conv,
      isActive: conv.id === id,
      unreadCount: conv.id === id ? 0 : conv.unreadCount,
    })));
    
    // On mobile, open the chat window when a conversation is selected
    setIsMobileChatOpen(true);
  }, []);
  
  // Handle back button on mobile
  const handleMobileBack = useCallback(() => {
    setIsMobileChatOpen(false);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || !activeConversationId) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      timestamp: timeString,
      isOwn: true,
    };

    // Add message to the active conversation
    setMessagesMap(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }));

    // Update the last message in conversations list (will be synced via syncedConversations)
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? { ...conv, lastMessageTime: 'Now' }
        : conv
    ));
  }, [activeConversationId]);

  // Handle adding a new conversation
  const handleAddConversation = useCallback((name: string, avatarUrl: string) => {
    const newId = `${Date.now()}`;
    
    const newConversation: Conversation = {
      id: newId,
      name,
      avatar: avatarUrl,
      lastMessage: 'No messages yet',
      lastMessageTime: 'Now',
      unreadCount: 0,
      isOnline: false,
      status: 'offline',
      isActive: false,
    };

    // Add to conversations list
    setConversations(prev => [newConversation, ...prev]);
    
    // Initialize empty message array
    setMessagesMap(prev => ({
      ...prev,
      [newId]: [],
    }));

    // Auto-select the new conversation
    handleConversationSelect(newId);
    
    // Close modal
    setIsAddChatModalOpen(false);
  }, [handleConversationSelect]);

  return (
    <div className="h-full flex flex-col font-poppins">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Main Chat Container - Lower z-index than navbar, with better spacing */}
      <main className="relative z-10 flex-1 min-h-0 px-1.5 py-2 sm:px-2 sm:py-2.5 md:px-3 md:py-3 lg:p-4 max-w-[1600px] mx-auto w-full flex">
        <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 w-full h-full flex overflow-hidden mt-3 md:mt-0">
          
          {/* Sidebar - Hide on mobile when chat is open - Use syncedConversations */}
          <div className={`${isMobileChatOpen ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
            <ChatSidebar
              conversations={syncedConversations}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              onAddChat={() => setIsAddChatModalOpen(true)}
            />
          </div>

          {/* Chat Window & Input - Show on desktop always, on mobile only when chat is open */}
          <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0 w-full`}>
            <ChatWindow
              conversation={activeConversation}
              messages={activeMessages}
              onMobileBack={handleMobileBack}
            />
            <ChatInput 
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </main>

      {/* Add Chat Modal */}
      <AddChatModal
        isOpen={isAddChatModalOpen}
        onClose={() => setIsAddChatModalOpen(false)}
        onAddChat={handleAddConversation}
      />
    </div>
  );
}
