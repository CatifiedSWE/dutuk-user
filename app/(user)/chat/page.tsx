import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="solid" />
      </div>
      <ChatScreen />
      <Footer />
    </div>
  );
}
