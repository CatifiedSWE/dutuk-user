import { Suspense } from 'react';
import Header from '@/components/Header';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
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
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
          <ChatScreen />
        </Suspense>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
