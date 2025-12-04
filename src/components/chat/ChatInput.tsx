import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/useVoice';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoice();

  useEffect(() => {
    if (transcript) setMessage(prev => prev + transcript);
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative flex items-end gap-2 bg-secondary rounded-2xl p-2">
        <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:text-foreground">
          <Paperclip className="w-4 h-4" />
        </Button>

        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={isListening ? stopListening : startListening}
            className={isListening ? "text-destructive" : "text-muted-foreground hover:text-foreground"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        )}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => { setMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Message NEXUS..."}
          className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground py-2 px-1 max-h-[200px] text-sm"
          rows={1}
          disabled={isLoading}
        />

        <Button type="submit" size="icon-sm" disabled={!message.trim() || isLoading} className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">NEXUS can make mistakes. Consider checking important information.</p>
    </form>
  );
}
