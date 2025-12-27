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

      {/* Main Chat Container - Minimal vertical padding for max height */}
      <main className="relative z-10 flex-1 px-2 py-1.5 sm:px-3 sm:py-2 md:p-4 max-w-[1600px] mx-auto w-full flex">
        <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 w-full flex overflow-hidden">
          {/* Sidebar */}
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onAddChat={() => setIsAddChatModalOpen(true)}
          />

          {/* Chat Window & Input - Desktop */}
          <div className="hidden md:flex flex-1 flex-col min-w-0">
            <ChatWindow
              conversation={activeConversation}
              messages={activeMessages}
            />
            <ChatInput 
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Mobile Empty State */}
          <div className="md:hidden flex-1 w-full flex items-center justify-center bg-gray-50 p-8 text-center text-gray-500">
            <div>
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-medium text-gray-600">Select a conversation to start chatting.</p>
            </div>
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
