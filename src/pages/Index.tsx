import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { useConversations } from '@/hooks/useConversations';
import { useChatWithMemory } from '@/hooks/useChatWithMemory';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    deleteConversation,
    loading: conversationsLoading,
  } = useConversations();

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initialLoading,
  } = useChatWithMemory(currentConversationId);

  const handleNewChat = useCallback(async () => {
    clearMessages();
    const conv = await createConversation('New Chat');
    if (conv) {
      setCurrentConversationId(conv.id);
    }
  }, [createConversation, clearMessages, setCurrentConversationId]);

  const handleSendMessage = useCallback(async (content: string) => {
    let convId = currentConversationId;
    if (!convId) {
      const conv = await createConversation('New Chat');
      if (conv) {
        convId = conv.id;
        setCurrentConversationId(conv.id);
      }
    }
    if (convId) {
      sendMessage(content, convId);
    }
  }, [currentConversationId, createConversation, sendMessage, setCurrentConversationId]);

  if (authLoading || conversationsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onNewChat={handleNewChat}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={deleteConversation}
      />
      <main className="flex-1 overflow-hidden">
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          initialLoading={initialLoading}
        />
      </main>
    </div>
  );
}
