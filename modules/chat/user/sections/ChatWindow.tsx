'use client';

import React from 'react';
import { Phone, Video, MoreVertical, Download, ArrowLeft } from 'lucide-react';
import { Conversation, Message } from '@/demo/chatData';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onMobileBack?: () => void;
}

export default function ChatWindow({ conversation, messages, onMobileBack }: ChatWindowProps) {
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
      {/* Chat Header - Compact height on small screens */}
      <div className="flex-shrink-0 h-14 md:h-14 lg:h-16 px-3 md:px-4 lg:px-6 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {/* Mobile Back Button */}
          {onMobileBack && (
            <button
              onClick={onMobileBack}
              className="md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#7C2A2A] hover:bg-[#FFF0F0] rounded-full transition-colors active:scale-95"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 p-0.5 ring-1 ring-[#7C2A2A]/10">
              <img
                alt={conversation.name}
                className="w-full h-full rounded-full object-cover"
                src={conversation.avatar}
              />
            </div>
            {conversation.status === 'online' && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans font-bold text-sm md:text-base lg:text-lg text-gray-900 leading-tight truncate">{conversation.name}</h2>
            {conversation.status === 'online' && (
              <p className="text-[10px] md:text-xs text-green-600 font-medium flex items-center gap-1 md:gap-1.5 mt-0.5">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
          <button className="w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-400 hover:text-[#7C2A2A] hover:bg-[#FFF0F0] rounded-full transition-colors active:scale-95" title="Voice Call">
            <Phone className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </button>
          <button className="w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-400 hover:text-[#7C2A2A] hover:bg-[#FFF0F0] rounded-full transition-colors active:scale-95" title="Video Call">
            <Video className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </button>
          <div className="w-px h-4 md:h-5 lg:h-6 bg-gray-200 mx-1 md:mx-2" />
          <button className="w-9 h-9 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors active:scale-95">
            <MoreVertical className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area - Optimized for mobile with generous top padding to prevent cutoff */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 pt-8 pb-2 sm:px-3 sm:pt-8 sm:pb-2 md:px-4 md:pt-8 md:pb-3 lg:px-6 lg:pt-10 lg:pb-4 space-y-3 md:space-y-3 bg-[#FDFBF9]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm md:text-base font-medium">No messages yet</p>
              <p className="text-xs md:text-sm mt-1">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Date Divider */}
            <div className="flex justify-center my-3 md:my-3 lg:my-4">
              <span className="text-[10px] md:text-[11px] font-semibold tracking-wide text-gray-400 uppercase bg-gray-100/70 px-3 md:px-3 lg:px-4 py-1.5 md:py-1.5 rounded-full border border-gray-100 shadow-sm">
                Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.isOwn ? 'items-end ml-auto max-w-[85%] sm:max-w-[80%] md:max-w-[85%] lg:max-w-[70%]' : 'items-start mr-auto max-w-[85%] sm:max-w-[80%] md:max-w-[85%] lg:max-w-[70%] group'
                }`}
              >
                {message.isOwn ? (
                  // Own Message (Right side - User)
                  <>
                    <div className="bg-[#7C2A2A] p-3 px-4 sm:p-3 sm:px-4 md:p-4 md:px-5 rounded-2xl rounded-br-md shadow-lg text-white text-sm md:text-[15px] leading-relaxed break-words">
                      {message.text}
                      {message.hasFile && (
                        <div className="mt-2 md:mt-3 flex items-center gap-2 md:gap-3 bg-white/10 p-2.5 md:p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group/file">
                          <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center text-[#7C2A2A] shadow-sm group-hover/file:scale-105 transition-transform flex-shrink-0">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0 pr-1 md:pr-2">
                            <p className="font-medium text-xs md:text-sm truncate">{message.fileName}</p>
                            <p className="text-[10px] md:text-xs text-white/70">{message.fileSize}</p>
                          </div>
                          <Download className="w-4 h-4 md:w-5 md:h-5 text-white/70 flex-shrink-0" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 md:mt-1.5 mr-1">
                      <span className="text-[9px] md:text-[10px] font-medium text-gray-400">{message.timestamp}</span>
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#7C2A2A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" transform="translate(5, 0)" />
                      </svg>
                    </div>
                  </>
                ) : (
                  // Received Message (Left side - Sender)
                  <>
                    <div className="flex items-end gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0 mb-1 ring-1 ring-gray-100">
                        <img
                          className="w-full h-full object-cover"
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                      </div>
                      <div className="bg-white p-3 px-4 sm:p-3 sm:px-4 md:p-4 md:px-5 rounded-2xl rounded-bl-md shadow-sm text-gray-800 text-sm md:text-[15px] leading-relaxed border border-gray-100 break-words">
                        {message.text}
                      </div>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-medium text-gray-400 mt-1 md:mt-1.5 ml-[36px] md:ml-[52px]">{message.timestamp}</span>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
