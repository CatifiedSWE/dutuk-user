'use client';

import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import { Conversation } from '@/demo/chatData';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect?: (id: string) => void;
  onAddChat?: () => void;
}

export default function ChatSidebar({ 
  conversations, 
  activeConversationId, 
  onConversationSelect,
  onAddChat 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full md:w-[340px] lg:w-[400px] flex flex-col border-r border-gray-100 bg-white z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-sans text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <button 
            onClick={onAddChat}
            className="p-2 bg-[#FFF0F0] text-[#7C2A2A] rounded-full hover:bg-red-100 transition-colors"
            title="New Chat"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#7C2A2A] transition-colors" />
          <input
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#7C2A2A]/10 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#7C2A2A]/5 focus:bg-white transition-all"
            placeholder="Search conversations..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect?.(conversation.id)}
              className={`p-3 rounded-2xl cursor-pointer relative group transition-all duration-200 ${
                conversation.id === activeConversationId
                  ? 'bg-[#FFF0F0]/40 border border-[#7C2A2A]/5'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gray-200 overflow-hidden shadow-sm ${
                    conversation.id === activeConversationId ? 'ring-2 ring-white' : 'ring-1 ring-gray-100'
                  } ${
                    !conversation.isOnline ? 'grayscale opacity-70' : ''
                  }`}>
                    <img
                      alt={conversation.name}
                      className="w-full h-full object-cover"
                      src={conversation.avatar}
                    />
                  </div>
                  {/* Online Status Indicator */}
                  {conversation.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white rounded-full" />
                  )}
                  {conversation.status === 'away' && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border-[2.5px] border-white rounded-full" />
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-sans font-semibold truncate text-[15px] ${
                      conversation.id === activeConversationId
                        ? 'text-gray-900'
                        : 'text-gray-900 group-hover:text-[#7C2A2A]'
                    } transition-colors`}>
                      {conversation.name}
                    </h3>
                    <span className={`text-[11px] font-medium ${
                      conversation.id === activeConversationId ? 'text-[#7C2A2A]' : 'text-gray-400'
                    }`}>
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <p className={`text-xs font-medium truncate ${
                    conversation.id === activeConversationId
                      ? 'text-[#7C2A2A]/80'
                      : conversation.isOnline
                      ? 'text-gray-500 group-hover:text-gray-700'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0">
                    <span className="w-5 h-5 rounded-full bg-[#7C2A2A] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
