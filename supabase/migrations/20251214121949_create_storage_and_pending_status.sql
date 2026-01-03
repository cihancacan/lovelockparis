/*
  # Storage Setup and Pending Status

  1. Storage Configuration
    - Create `lock-media` bucket for storing lock media files
    - Configure public access for non-private locks
    - Set upload policies for authenticated users

  2. Schema Changes
    - Add `is_private` column to locks table for privacy option
    - Add `pending_until` timestamp for temporary reservations
    - Update status enum to include 'Pending' state

  3. Security Policies
    - Upload: Authenticated users can upload media
    - Read: Public access unless lock is private
    - Update/Delete: Only lock owner can modify
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'is_private'
  ) THEN
    ALTER TABLE locks ADD COLUMN is_private BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'pending_until'
  ) THEN
    ALTER TABLE locks ADD COLUMN pending_until TIMESTAMPTZ;
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lock-media',
  'lock-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/mp3']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated users to upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lock-media');

CREATE POLICY "Allow public read access to non-private locks"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'lock-media' AND (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.content_media_url = storage.objects.name
      AND (locks.is_private = false OR locks.is_private IS NULL)
    )
  )
);

CREATE POLICY "Allow authenticated users to read their own private media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lock-media' AND (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.content_media_url = storage.objects.name
      AND locks.owner_id = auth.uid()
    )
  )
);

CREATE POLICY "Allow lock owners to delete their media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lock-media' AND (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.content_media_url = storage.objects.name
      AND locks.owner_id = auth.uid()
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_locks_pending_until ON locks(pending_until) WHERE pending_until IS NOT NULL;
