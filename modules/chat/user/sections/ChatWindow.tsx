'use client';

import React from 'react';
import { Phone, Video, MoreVertical, Download } from 'lucide-react';
import { Conversation, Message } from '@/demo/chatData';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
}

export default function ChatWindow({ conversation, messages }: ChatWindowProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FDFBF9] p-8 text-center text-gray-500">
        <div>
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">Select a conversation to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="flex-shrink-0 h-20 px-8 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gray-50 p-0.5 ring-1 ring-[#7C2A2A]/10">
              <img
                alt={conversation.name}
                className="w-full h-full rounded-full object-cover"
                src={conversation.avatar}
              />
            </div>
            {conversation.status === 'online' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h2 className="font-sans font-bold text-lg text-gray-900 leading-tight">{conversation.name}</h2>
            {conversation.status === 'online' && (
              <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#7C2A2A] hover:bg-[#FFF0F0] rounded-full transition-colors" title="Voice Call">
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#7C2A2A] hover:bg-[#FFF0F0] rounded-full transition-colors" title="Video Call">
            <Video className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-6 bg-[#FDFBF9]">
        {/* Date Divider */}
        <div className="flex justify-center my-6">
          <span className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase bg-gray-100/70 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
            Today, Oct 24
          </span>
        </div>

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.isOwn ? 'items-end ml-auto max-w-[85%] lg:max-w-[70%]' : 'items-start mr-auto max-w-[85%] lg:max-w-[70%] group'
            }`}
          >
            {message.isOwn ? (
              // Own Message (Right side - User)
              <>
                <div className="bg-[#7C2A2A] p-4 px-5 rounded-2xl rounded-br-none shadow-lg text-white text-[15px] leading-relaxed">
                  {message.text}
                  {message.hasFile && (
                    <div className="mt-3 flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group/file">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#7C2A2A] shadow-sm group-hover/file:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-sm truncate">{message.fileName}</p>
                        <p className="text-xs text-white/70">{message.fileSize}</p>
                      </div>
                      <Download className="w-5 h-5 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1.5 mr-1">
                  <span className="text-[10px] font-medium text-gray-400">{message.timestamp}</span>
                  <svg className="w-3.5 h-3.5 text-[#7C2A2A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" transform="translate(5, 0)" />
                  </svg>
                </div>
              </>
            ) : (
              // Received Message (Left side - Sender)
              <>
                <div className="flex items-end gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1 ring-1 ring-gray-100">
                    <img
                      className="w-full h-full object-cover"
                      src={conversation.avatar}
                      alt={conversation.name}
                    />
                  </div>
                  <div className="bg-white p-4 px-5 rounded-2xl rounded-bl-none shadow-sm text-gray-800 text-[15px] leading-relaxed border border-gray-100">
                    {message.text}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-400 mt-1.5 ml-[52px]">{message.timestamp}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
