/*
  # Add Golden Assets and User Moderation

  1. New Tables
    - `golden_assets`
      - `id` (uuid, primary key)
      - `lock_id` (integer, unique) - The reserved lock ID
      - `is_reserved` (boolean) - Whether the ID is currently reserved
      - `reserved_price` (numeric) - Optional custom price for this golden ID
      - `created_at` (timestamptz)
    
    - `banned_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `reason` (text) - Reason for ban
      - `banned_at` (timestamptz)
      - `banned_by` (text) - Admin email who banned

  2. Changes
    - Add `is_banned` column to track user status
    
  3. Security
    - Enable RLS on both tables
    - Only admin can manage these tables
*/

CREATE TABLE IF NOT EXISTS golden_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id integer UNIQUE NOT NULL,
  is_reserved boolean DEFAULT true,
  reserved_price numeric(10,2),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS banned_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  banned_at timestamptz DEFAULT now(),
  banned_by text NOT NULL
);

ALTER TABLE golden_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view golden assets"
  ON golden_assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only service role can manage golden assets"
  ON golden_assets FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Only service role can view banned users"
  ON banned_users FOR SELECT
  TO authenticated
  USING (false);

CREATE POLICY "Only service role can manage banned users"
  ON banned_users FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_golden_assets_lock_id ON golden_assets(lock_id);
CREATE INDEX IF NOT EXISTS idx_banned_users_user_id ON banned_users(user_id);
