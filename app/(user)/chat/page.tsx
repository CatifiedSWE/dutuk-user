import Header from '@/components/Header';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-[#FDFBF7] overflow-hidden">
      {/* Fixed Header - approximately 10-15% of screen height */}
      <div className="flex-shrink-0">
        <Header variant="solid" />
      </div>
      
      {/* Chat Content - approximately 85-90% of screen height */}
      <div className="flex-1 overflow-hidden">
        <ChatScreen />
      </div>
    </div>
  );
}
