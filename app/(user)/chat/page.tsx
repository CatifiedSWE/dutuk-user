import { Suspense } from 'react';
import Header from '@/components/Header';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import ChatScreen from '@/modules/chat/user/ChatScreen';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function ChatPageContent() {
  return (
    <div className="h-screen flex flex-col bg-[#FDFBF7] overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden lg:block flex-shrink-0 h-[60px] md:h-[70px] lg:h-[80px] relative z-50">
        <Header variant="solid" />
      </div>

      {/* Mobile Top Navigation */}
      <MobileTopNav />
      
      {/* Chat Content - Fill remaining space with proper padding for mobile nav */}
      <div className="flex-1 min-h-0 overflow-hidden relative z-10 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <ChatScreen />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-[#7C2A2A]/20 border-t-[#7C2A2A] rounded-full animate-spin"></div>
          <p className="text-sm text-[#4F0000]/60">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
