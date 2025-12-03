import { Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea, useChat } from '@/components/chat/ChatArea';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatArea />
      </main>
    </div>
  );
};

export default Index;
