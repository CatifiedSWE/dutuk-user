import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatScreen from '@/modules/chat/user/ChatScreen';

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header variant="solid" />
      <ChatScreen />
      <Footer />
    </div>
  );
}
