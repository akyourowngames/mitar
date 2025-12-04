import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChatWithMemory(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load messages for current conversation
  useEffect(() => {
    if (!conversationId || !user) {
      setMessages([]);
      setInitialLoading(false);
      return;
    }

    const loadMessages = async () => {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })));
      }
      setInitialLoading(false);
    };

    loadMessages();
  }, [conversationId, user]);

  const saveMessage = useCallback(async (
    content: string, 
    role: 'user' | 'assistant',
    convId: string
  ) => {
    if (!user) return;

    await supabase.from('messages').insert({
      conversation_id: convId,
      user_id: user.id,
      role,
      content,
    });
  }, [user]);

  const sendMessage = useCallback(async (content: string, convId: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Save user message
    await saveMessage(content, 'user', convId);

    let assistantContent = '';
    const assistantId = (Date.now() + 1).toString();

    // Add empty assistant message
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      // Include conversation history for context (memory)
      const historyMessages = [...messages, userMessage].slice(-20); // Last 20 messages for context

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: historyMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }

      // Save assistant message
      if (assistantContent) {
        await saveMessage(assistantContent, 'assistant', convId);
      }

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await supabase
          .from('conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', convId);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  }, [messages, user, saveMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages, initialLoading };
}
