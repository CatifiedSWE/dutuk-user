'use client';

import React, { useState, useCallback } from 'react';
import ChatSidebar from './sections/ChatSidebar';
import ChatWindow from './sections/ChatWindow';
import ChatInput from './sections/ChatInput';
import AddChatModal from './sections/AddChatModal';
import { demoConversations, demoMessages, Conversation, Message } from '@/demo/chatData';

export default function ChatScreen() {
  // Active conversation state
  const [activeConversationId, setActiveConversationId] = useState('1');
  
  // Mobile view state - tracks if we're viewing chat window or sidebar on mobile
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // All conversations state
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  
  // Messages organized by conversation ID
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    '1': demoMessages,
    '2': [],
    '3': [],
    '4': [],
  });
  
  // Modal state
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = messagesMap[activeConversationId] || [];

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

    // Update the last message in conversations list
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? { ...conv, lastMessage: text.trim(), lastMessageTime: 'Now' }
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
          
          {/* Sidebar - Hide on mobile when chat is open */}
          <div className={`${isMobileChatOpen ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
            <ChatSidebar
              conversations={conversations}
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
