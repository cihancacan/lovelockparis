/*
  # Create Purchase History Tracking

  This migration creates a system to track and display recent purchase notifications.

  1. New Tables
    - `purchase_notifications`
      - `id` (uuid, primary key)
      - `lock_id` (integer, references locks)
      - `initials` (text) - Customer initials for display
      - `zone` (text) - Zone where lock was purchased
      - `skin` (text) - Type of lock purchased
      - `created_at` (timestamptz) - Purchase timestamp
      - `buyer_ip` (text) - IP address for filtering

  2. Security
    - Enable RLS on `purchase_notifications` table
    - Allow public read access (for displaying notifications)
    - Only authenticated users can insert (done via edge function)

  3. Indexes
    - Index on created_at for efficient sorting
    - Index on buyer_ip for filtering
*/

-- Create purchase_notifications table
CREATE TABLE IF NOT EXISTS purchase_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id integer REFERENCES locks(id),
  initials text NOT NULL,
  zone text NOT NULL,
  skin text NOT NULL,
  created_at timestamptz DEFAULT now(),
  buyer_ip text
);

-- Enable RLS
ALTER TABLE purchase_notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read purchase notifications
CREATE POLICY "Anyone can view purchase notifications"
  ON purchase_notifications
  FOR SELECT
  USING (true);

-- Only service role can insert notifications
CREATE POLICY "Service role can insert notifications"
  ON purchase_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_purchase_notifications_created_at ON purchase_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_notifications_buyer_ip ON purchase_notifications(buyer_ip);

-- Function to clean up old notifications (keep only last 100)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM purchase_notifications
  WHERE id NOT IN (
    SELECT id FROM purchase_notifications
    ORDER BY created_at DESC
    LIMIT 100
  );
END;
$$;

COMMENT ON TABLE purchase_notifications IS 'Tracks recent purchases to display live notifications on homepage';
COMMENT ON COLUMN purchase_notifications.initials IS 'Customer initials (e.g., "J.D.")';
COMMENT ON COLUMN purchase_notifications.buyer_ip IS 'IP address used to filter duplicate notifications for same user';
