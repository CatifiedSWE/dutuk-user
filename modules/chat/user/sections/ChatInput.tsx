'use client';

import React, { useState } from 'react';
import { PlusCircle, Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
      <form className="relative flex items-center gap-1.5 md:gap-2 lg:gap-3" onSubmit={handleSubmit}>
        <button
          className="p-1.5 md:p-2 text-gray-400 hover:text-[#7C2A2A] hover:bg-gray-50 rounded-full transition-colors flex-shrink-0"
          type="button"
          title="Attach file"
        >
          <PlusCircle className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6" />
        </button>
        
        <div className="relative flex-grow">
          <input
            className="w-full pl-3 md:pl-4 pr-9 md:pr-10 py-1.5 md:py-2 lg:py-2.5 rounded-lg md:rounded-xl lg:rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#7C2A2A]/10 focus:border-[#7C2A2A]/30 transition-all duration-200 text-sm text-gray-900 placeholder-gray-400"
            placeholder="Type your message here..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
            title="Add emoji"
          >
            <Smile className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        
        <button
          className="p-1.5 md:p-2 lg:p-2.5 bg-[#7C2A2A] text-white rounded-lg md:rounded-xl hover:bg-[#5e0000] shadow-md shadow-[#7C2A2A]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
          disabled={!message.trim()}
          title="Send message"
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
}
