import { motion } from 'framer-motion';
import { Copy, Bookmark, Play, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn('flex gap-3 group', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isUser
            ? 'bg-secondary'
            : 'bg-primary/20 glow-primary-sm'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 relative',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'glass rounded-tl-sm'
          )}
        >
          {message.isLoading ? (
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-current animate-typing" />
              <span className="w-2 h-2 rounded-full bg-current animate-typing" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-current animate-typing" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Action bar */}
        {!isUser && !message.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Bookmark className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Play className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
