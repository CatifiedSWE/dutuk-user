'use client';

import React, { useState } from 'react';
import { PlusCircle, Send, Smile } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message send
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <form className="relative flex items-center gap-4" onSubmit={handleSubmit}>
        <button
          className="p-2 text-gray-400 hover:text-[#7C2A2A] hover:bg-gray-50 rounded-full transition-colors flex-shrink-0"
          type="button"
        >
          <PlusCircle className="w-7 h-7" />
        </button>
        
        <div className="relative flex-grow">
          <input
            className="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#7C2A2A]/10 focus:border-[#7C2A2A]/30 transition-all duration-200 text-sm text-gray-900 placeholder-gray-400"
            placeholder="Type your message here..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
        
        <button
          className="p-3.5 bg-[#7C2A2A] text-white rounded-xl hover:bg-[#5e0000] shadow-md shadow-[#7C2A2A]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0"
          type="submit"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
