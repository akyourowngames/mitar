import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Attachment } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function useFileUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<Attachment | null> => {
    if (!user) {
      setError('Must be logged in to upload files');
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return null;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not supported');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(data.path);

      return {
        id: data.path,
        name: file.name,
        type: file.type,
        url: publicUrl,
        size: file.size,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [user]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<Attachment[]> => {
    const results: Attachment[] = [];
    for (const file of files) {
      const attachment = await uploadFile(file);
      if (attachment) results.push(attachment);
    }
    return results;
  }, [uploadFile]);

  return { uploadFile, uploadMultiple, uploading, error, clearError: () => setError(null) };
}
