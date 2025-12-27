import Header from '@/components/Header';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-[#FDFBF7] overflow-hidden">
      {/* Fixed Header - Reduced height for better space usage */}
      <div className="flex-shrink-0 h-[60px] md:h-[70px] lg:h-[80px]">
        <Header variant="solid" />
      </div>
      
      {/* Chat Content - Fill remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatScreen />
      </div>
    </div>
  );
}
