import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
}

export function VoiceButton({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  disabled,
}: VoiceButtonProps) {
  if (isSpeaking) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onStopSpeaking}
        className="shrink-0 text-primary"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <VolumeX className="w-4 h-4" />
        </motion.div>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={isListening ? onStopListening : onStartListening}
      disabled={disabled}
      className={cn(
        "shrink-0 transition-colors",
        isListening ? "text-destructive" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <MicOff className="w-4 h-4" />
        </motion.div>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
}
