-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true);

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to view their attachments
CREATE POLICY "Users can view attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-attachments');

-- Allow users to delete their own attachments
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add attachments column to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;