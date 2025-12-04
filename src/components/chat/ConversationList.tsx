import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Conversation } from '@/hooks/useConversations';

interface ConversationListProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  collapsed: boolean;
}

export function ConversationList({
  conversations,
  currentId,
  onSelect,
  onDelete,
  collapsed,
}: ConversationListProps) {
  if (collapsed || conversations.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      <p className="text-xs text-muted-foreground px-3 py-1">Recent</p>
      <AnimatePresence>
        {conversations.slice(0, 10).map((conv) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              onClick={() => onSelect(conv.id)}
              className={cn(
                'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                currentId === conv.id
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm truncate flex-1">{conv.title || 'New Chat'}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
