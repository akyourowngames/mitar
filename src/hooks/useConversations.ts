import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  conversation_id: string;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all conversations
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setCurrentConversationId(null);
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setConversations(data);
      }
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createConversation = useCallback(async (title: string = 'New Chat') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    setCurrentConversationId(data.id);
    return data;
  }, [user]);

  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    // First delete all messages
    await supabase.from('messages').delete().eq('conversation_id', conversationId);
    // Then delete the conversation
    await supabase.from('conversations').delete().eq('id', conversationId);
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  }, [currentConversationId]);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    loading,
  };
}
