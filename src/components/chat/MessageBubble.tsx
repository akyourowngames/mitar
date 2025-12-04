import { Bot, User, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={cn('flex-1 max-w-[80%] group', isUser && 'flex flex-col items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}>
          {message.content ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
        
        {!isUser && message.content && onSpeak && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSpeak(message.content)}
            className="mt-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
