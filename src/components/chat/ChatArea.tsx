import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Bot, Sparkles, Image, Code, FileText, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '@/hooks/useVoice';
import type { Attachment } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  initialLoading?: boolean;
}

const capabilities = [
  { icon: Code, label: 'Code Assistant', desc: 'Write, debug, and explain code' },
  { icon: Image, label: 'Image Analysis', desc: 'Upload and analyze images' },
  { icon: FileText, label: 'Document Processing', desc: 'Read PDFs, docs, and more' },
  { icon: Mic, label: 'Voice Interaction', desc: 'Speak and listen' },
];

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
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25"
              >
                <Bot className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3"
              >
                Hi, I'm MITAR
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-md mb-8"
              >
                Your advanced AI assistant with memory. I remember our conversations and can help with anything.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 max-w-lg"
              >
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-default"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <cap.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{cap.label}</p>
                      <p className="text-xs text-muted-foreground">{cap.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2 text-xs text-muted-foreground mt-8"
              >
                <Sparkles className="w-3 h-3" />
                <span>Upload files, use voice, or just type</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-8 px-4 space-y-6"
            >
              {messages.map((message, index) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onSpeak={handleSpeak}
                  isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                />
              ))}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm text-center py-2 px-4 bg-destructive/10 rounded-lg"
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
      <div className="border-t border-border/50 p-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
