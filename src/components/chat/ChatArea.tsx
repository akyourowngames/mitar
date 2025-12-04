import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '@/hooks/useVoice';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  initialLoading?: boolean;
}

export function ChatArea({ 
  messages, 
  isLoading, 
  error, 
  onSendMessage,
  initialLoading 
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {initialLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6"
              >
                <Bot className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-foreground mb-3"
              >
                How can I help you today?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-md mb-6"
              >
                I'm NEXUS, your AI assistant with memory. I remember our conversations and can help with questions, tasks, coding, and more.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Sparkles className="w-3 h-3" />
                <span>Voice input & output supported</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-8 px-4 space-y-6"
            >
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onSpeak={handleSpeak}
                />
              ))}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive text-sm text-center py-2"
                >
                  {error}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
