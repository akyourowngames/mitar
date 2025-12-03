import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass rounded-2xl p-2">
        <div className="flex items-end gap-2">
          {/* File upload */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask NEXUS anything..."
              className="w-full bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground py-2 px-1 max-h-[150px] scrollbar-thin"
              rows={1}
              disabled={isLoading}
            />
          </div>

          {/* Voice button */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isRecording ? 'recording' : 'idle'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Button
                type="button"
                variant={isRecording ? 'destructive' : 'ghost'}
                size="icon"
                onClick={toggleRecording}
                className={cn(
                  'shrink-0 relative',
                  isRecording && 'animate-pulse'
                )}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 text-muted-foreground" />
                )}
                {isRecording && (
                  <span className="absolute inset-0 rounded-lg animate-pulse-ring bg-destructive/30" />
                )}
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Send button */}
          <Button
            type="submit"
            variant="glow"
            size="icon"
            disabled={!message.trim() || isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
