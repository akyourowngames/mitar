import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message } from '@/types';

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm NEXUS, your personal AI assistant. I can help you with tasks, answer questions, manage your calendar, and much more. How can I assist you today?",
  timestamp: new Date(),
};

const sampleResponses = [
  "I understand. Let me help you with that. Based on my analysis, here are some suggestions that might be useful for your situation.",
  "That's a great question! Here's what I found after searching through my knowledge base and recent data.",
  "I've processed your request. Here's a comprehensive breakdown of the information you need.",
  "Interesting! Let me think about this for a moment... Alright, here's my recommendation based on the context you've provided.",
];

export function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    const loadingMessage: Message = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responseContent = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat(assistantMessage));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 border-b border-border"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">NEXUS Assistant</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by AI
          </p>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
