'use client';

import React, { useState } from 'react';
import { PlusCircle, Send, Smile, ShieldCheck } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  paymentCompleted?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false, paymentCompleted = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
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
    <div className="px-3 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
      {/* Payment Completed Badge */}
      {paymentCompleted && (
        <div className="mb-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <p className="text-xs text-green-700">
            ✓ Payment completed - You can now share contact information
          </p>
        </div>
      )}
      
      <form className="relative flex items-center gap-2 md:gap-2 lg:gap-3" onSubmit={handleSubmit}>
        <button
          className="p-2 md:p-2 text-gray-400 hover:text-[#7C2A2A] hover:bg-gray-50 active:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          type="button"
          title="Attach file"
          disabled={disabled}
        >
          <PlusCircle className="w-5 h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6" />
        </button>
        
        <div className="relative flex-grow">
          <input
            className="w-full pl-4 md:pl-4 pr-10 md:pr-10 py-2.5 md:py-2 lg:py-2.5 rounded-xl md:rounded-xl lg:rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#7C2A2A]/10 focus:border-[#7C2A2A]/30 transition-all duration-200 text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={disabled ? "Sending..." : "Type your message here..."}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 active:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
            type="button"
            title="Add emoji"
            disabled={disabled}
          >
            <Smile className="w-5 h-5 md:w-5 md:h-5" />
          </button>
        </div>
        
        <button
          className="p-2.5 md:p-2 lg:p-2.5 bg-[#7C2A2A] text-white rounded-xl md:rounded-xl hover:bg-[#5e0000] shadow-md shadow-[#7C2A2A]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
          disabled={!message.trim() || disabled}
          title="Send message"
        >
          <Send className="w-5 h-5 md:w-5 md:h-5" />
        </button>
      </form>
    </div>
  );
}
