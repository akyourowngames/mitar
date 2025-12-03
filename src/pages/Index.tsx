import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';

const Index = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-0">
        <ChatArea />
      </main>
    </div>
  );
};

export default Index;
