'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ChatSidebar from './sections/ChatSidebar';
import ChatWindow from './sections/ChatWindow';
import ChatInput from './sections/ChatInput';
import AddChatModal from './sections/AddChatModal';
import TermsConditionsModal from './components/TermsConditionsModal';
import { useConversations, useAcceptTerms } from '@/hooks/useConversations';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Fetch conversations
  const { conversations: rawConversations, loading: conversationsLoading, error: conversationsError, refetch: refetchConversations } = useConversations();
  
  // Active conversation state
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  // Mobile view state
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // Modal states
  const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  
  // Hooks for terms and messaging
  const { acceptTerms, loading: acceptingTerms } = useAcceptTerms();
  const { sendMessage, loading: sendingMessage, error: sendError } = useSendMessage();
  
  // Get active conversation details
  const activeConversation = rawConversations.find((c) => c.id === activeConversationId);
  
  // Determine if user is customer or vendor in active conversation
  const isCustomer = activeConversation?.customer_id === user?.id;
  const otherParticipantId = isCustomer ? activeConversation?.vendor_id : activeConversation?.customer_id;
  
  // Fetch messages for active conversation
  const { messages: rawMessages, loading: messagesLoading } = useMessages(
    activeConversationId,
    activeConversation?.payment_completed || false
  );
  
  // Set first conversation as active on load
  useEffect(() => {
    if (!activeConversationId && rawConversations.length > 0) {
      setActiveConversationId(rawConversations[0].id);
    }
  }, [rawConversations, activeConversationId]);
  
  // Transform conversations for sidebar display
  const conversations = useMemo(() => {
    return rawConversations.map((conv) => {
      const isUserCustomer = conv.customer_id === user?.id;
      const otherPartyName = isUserCustomer ? (conv.vendor_name || conv.vendor_company || 'Vendor') : (conv.customer_name || 'Customer');
      const otherPartyAvatar = isUserCustomer ? (conv.vendor_avatar || '') : (conv.customer_avatar || '');
      
      return {
        id: conv.id,
        name: otherPartyName,
        avatar: otherPartyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherPartyName)}&background=7C2A2A&color=fff`,
        lastMessage: conv.last_message_preview || 'No messages yet',
        lastMessageTime: formatTimestamp(conv.last_message_at),
        unreadCount: conv.unread_count || 0,
        isOnline: false, // TODO: Implement online status
        status: 'offline' as const,
        isActive: conv.id === activeConversationId,
      };
    });
  }, [rawConversations, user, activeConversationId]);
  
  // Transform messages for display
  const messages = useMemo(() => {
    return rawMessages.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      text: msg.message_text,
      timestamp: formatTimestamp(msg.created_at),
      isOwn: msg.sender_id === user?.id,
      hasAttachment: msg.has_attachment,
      attachmentUrl: msg.attachment_url || undefined,
      attachmentName: msg.attachment_name || undefined,
    }));
  }, [rawMessages, user]);
  
  // Handle conversation selection
  const handleConversationSelect = useCallback((id: string) => {
    setActiveConversationId(id);
    setIsMobileChatOpen(true);
  }, []);
  
  // Handle back button on mobile
  const handleMobileBack = useCallback(() => {
    setIsMobileChatOpen(false);
  }, []);
  
  // Handle sending a message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !activeConversationId || !otherParticipantId) return;
    
    // Check if terms need to be accepted
    if (isCustomer && !activeConversation?.terms_accepted_by_customer) {
      setPendingMessage(text);
      setIsTermsModalOpen(true);
      return;
    }
    
    // Send message
    const result = await sendMessage(
      {
        conversationId: activeConversationId,
        receiverId: otherParticipantId,
        text: text.trim(),
      },
      activeConversation?.payment_completed || false
    );
    
    if (!result.success && result.error) {
      alert(result.error); // Show contact filter error
    }
  }, [activeConversationId, otherParticipantId, isCustomer, activeConversation, sendMessage]);
  
  // Handle T&C acceptance
  const handleAcceptTerms = useCallback(async () => {
    if (!activeConversationId) return;
    
    const success = await acceptTerms(activeConversationId);
    
    if (success) {
      setIsTermsModalOpen(false);
      
      // Send the pending message
      if (pendingMessage && otherParticipantId) {
        await sendMessage(
          {
            conversationId: activeConversationId,
            receiverId: otherParticipantId,
            text: pendingMessage,
          },
          false // Still not payment completed, but terms accepted
        );
        setPendingMessage(null);
      }
      
      // Refetch conversations to update terms status
      refetchConversations();
    }
  }, [activeConversationId, pendingMessage, otherParticipantId, acceptTerms, sendMessage, refetchConversations]);
  
  // Handle T&C decline
  const handleDeclineTerms = useCallback(() => {
    setIsTermsModalOpen(false);
    setPendingMessage(null);
    
    // Optionally redirect to vendor profile
    if (activeConversation) {
      const vendorId = activeConversation.vendor_id;
      // router.push(`/vendors/profile/${vendorId}`);
    }
  }, [activeConversation]);
  
  // Handle adding a new conversation (placeholder)
  const handleAddConversation = useCallback((name: string, avatarUrl: string) => {
    // TODO: Implement conversation creation
    console.log('Create conversation with:', name);
    setIsAddChatModalOpen(false);
  }, []);
  
  // Loading state
  if (conversationsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7C2A2A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (conversationsError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading conversations</p>
          <button
            onClick={() => refetchConversations()}
            className="px-4 py-2 bg-[#7C2A2A] text-white rounded-lg hover:bg-[#5e0000]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="h-full flex flex-col font-poppins">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <main className="relative z-10 flex-1 min-h-0 px-4 py-4 max-w-[1600px] mx-auto w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#FDF5E6] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-[#7C2A2A]">chat</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Conversations Yet</h2>
            <p className="text-gray-600 mb-6">Start chatting with vendors to discuss your event needs</p>
            <button
              onClick={() => router.push('/explore')}
              className="px-6 py-3 bg-[#7C2A2A] text-white rounded-xl hover:bg-[#5e0000] transition-colors"
            >
              Browse Vendors
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col font-poppins">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Main Chat Container */}
      <main className="relative z-10 flex-1 min-h-0 px-1.5 py-2 sm:px-2 sm:py-2.5 md:px-3 md:py-3 lg:p-4 max-w-[1600px] mx-auto w-full flex">
        <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 w-full h-full flex overflow-hidden mt-3 md:mt-0">
          
          {/* Sidebar */}
          <div className={`${isMobileChatOpen ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
            <ChatSidebar
              conversations={conversations}
              activeConversationId={activeConversationId || ''}
              onConversationSelect={handleConversationSelect}
              onAddChat={() => setIsAddChatModalOpen(true)}
            />
          </div>

          {/* Chat Window & Input */}
          {activeConversationId && activeConversation ? (
            <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0 w-full`}>
              <ChatWindow
                conversation={conversations.find((c) => c.id === activeConversationId)!}
                messages={messages}
                onMobileBack={handleMobileBack}
                loading={messagesLoading}
              />
              <ChatInput 
                onSendMessage={handleSendMessage}
                disabled={sendingMessage}
                paymentCompleted={activeConversation.payment_completed}
              />
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FDF5E6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-[#7C2A2A]">forum</span>
                </div>
                <p className="text-gray-600">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Chat Modal */}
      <AddChatModal
        isOpen={isAddChatModalOpen}
        onClose={() => setIsAddChatModalOpen(false)}
        onAddChat={handleAddConversation}
      />
      
      {/* Terms & Conditions Modal */}
      <TermsConditionsModal
        isOpen={isTermsModalOpen}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
        onClose={() => {
          setIsTermsModalOpen(false);
          setPendingMessage(null);
        }}
      />
    </div>
  );
}

// Helper function to format timestamps
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
