'use client';

import React, { useState } from 'react';
import ChatSidebar from './sections/ChatSidebar';
import ChatWindow from './sections/ChatWindow';
import ChatInput from './sections/ChatInput';
import { demoConversations, demoMessages } from '@/demo/chatData';

export default function ChatScreen() {
  const [activeConversationId, setActiveConversationId] = useState('1');
  
  const activeConversation = demoConversations.find(c => c.id === activeConversationId) || demoConversations[0];

  return (
    <div className="relative min-h-screen flex flex-col font-poppins overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow p-4 md:p-6 lg:p-8 pt-24 md:pt-28 max-w-[1440px] mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full h-[calc(100vh-200px)] flex overflow-hidden">
          {/* Sidebar */}
          <ChatSidebar
            conversations={demoConversations}
            activeConversationId={activeConversationId}
            onConversationSelect={setActiveConversationId}
          />

          {/* Chat Window & Input - Desktop */}
          <div className="hidden md:flex flex-1 flex-col min-w-0">
            <ChatWindow
              conversation={activeConversation}
              messages={demoMessages}
            />
            <ChatInput />
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
    </div>
  );
}
