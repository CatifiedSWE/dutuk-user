import Header from '@/components/Header';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-[#FDFBF7] overflow-hidden">
      {/* Fixed Header - Higher z-index than chat content */}
      <div className="flex-shrink-0 h-[60px] md:h-[70px] lg:h-[80px] relative z-50">
        <Header variant="solid" />
      </div>
      
      {/* Chat Content - Fill remaining space, lower z-index */}
      <div className="flex-1 min-h-0 overflow-hidden relative z-10">
        <ChatScreen />
      </div>
    </div>
  );
}
