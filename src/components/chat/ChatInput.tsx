import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, X, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/useVoice';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { Attachment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoice();
  const { uploadFile, uploading } = useFileUpload();

  useEffect(() => {
    if (transcript) setMessage(prev => prev + transcript);
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isLoading && !uploading) {
      onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const attachment = await uploadFile(file);
      if (attachment) {
        setAttachments(prev => [...prev, attachment]);
      }
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <form onSubmit={handleSubmit}>
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative group"
              >
                {attachment.type.startsWith('image/') ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                    <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                    <span className="text-xs truncate max-w-[100px]">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="w-4 h-4 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-end gap-2 bg-secondary/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.csv,.json,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </Button>

        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "shrink-0 transition-colors",
              isListening ? "text-destructive animate-pulse" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        )}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Message MITAR..."}
          className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground py-2 px-1 max-h-[200px] text-sm"
          rows={1}
          disabled={isLoading}
        />

        <Button
          type="submit"
          size="icon-sm"
          disabled={(!message.trim() && attachments.length === 0) || isLoading || uploading}
          className="shrink-0 bg-primary hover:bg-primary/90 transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2 opacity-60">MITAR can make mistakes. Consider checking important information.</p>
    </form>
  );
}
