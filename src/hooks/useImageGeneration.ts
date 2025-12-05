import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useImageGeneration() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string): Promise<string | null> => {
    setGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.image || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image generation failed');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  return { generateImage, generating, error, clearError: () => setError(null) };
}
