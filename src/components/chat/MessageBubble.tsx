import { Bot, User, Volume2, VolumeX, Copy, Check, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Attachment } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
  isStreaming?: boolean;
}

export function MessageBubble({ message, onSpeak, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (onSpeak) {
      setSpeaking(!speaking);
      onSpeak(message.content);
    }
  };

  // Format content with markdown-like rendering
  const formatContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const [lang, ...lines] = code.split('\n');
        return (
          <pre key={i} className="bg-background/50 rounded-lg p-3 my-2 overflow-x-auto text-xs">
            <code>{lines.join('\n') || lang}</code>
          </pre>
        );
      }
      return part.split(/(`[^`]+`)/g).map((segment, j) => {
        if (segment.startsWith('`') && segment.endsWith('`')) {
          return (
            <code key={`${i}-${j}`} className="bg-background/50 px-1.5 py-0.5 rounded text-xs">
              {segment.slice(1, -1)}
            </code>
          );
        }
        return segment.split(/(\*\*[^*]+\*\*)/g).map((s, k) => {
          if (s.startsWith('**') && s.endsWith('**')) {
            return <strong key={`${i}-${j}-${k}`}>{s.slice(2, -2)}</strong>;
          }
          return s;
        });
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-3 group', isUser ? 'flex-row-reverse' : '')}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
        isUser ? 'bg-primary' : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={cn('flex-1 space-y-2', isUser ? 'flex flex-col items-end' : '')}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="relative">
                {attachment.type.startsWith('image/') ? (
                  <div className="relative rounded-lg overflow-hidden max-w-[300px]">
                    <img src={attachment.url} alt={attachment.name} className="max-h-[200px] object-contain" />
                  </div>
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-xs">{attachment.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message content */}
        {message.content && (
          <div className={cn(
            'rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed',
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary/50 text-foreground'
          )}>
            {formatContent(message.content)}
            {isStreaming && !isUser && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block w-1.5 h-4 bg-foreground/50 ml-1 rounded-full align-middle"
              />
            )}
          </div>
        )}

        {/* Loading state */}
        {!message.content && !isUser && (
          <div className="rounded-2xl px-4 py-3 bg-secondary/50">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        {/* Actions for assistant messages */}
        {!isUser && message.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button variant="ghost" size="icon-sm" onClick={handleCopy} className="h-7 w-7">
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </Button>
            {onSpeak && (
              <Button variant="ghost" size="icon-sm" onClick={handleSpeak} className="h-7 w-7">
                {speaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
