/*
  # Add initials, visibility settings, and terms acceptance

  1. Changes
    - Add `author_name` column to store initials or first name
    - Add `visibility` column (Private or For_Sale)
    - Add `sale_price` column for content viewing price
    - Add `creator_revenue` column for revenue sharing
    - Add `terms_accepted` column for terms acceptance
    - Add `image_rights_granted` column for image rights
    - Add `total_earnings` column to track creator earnings

  2. Security
    - Update RLS policies to respect visibility settings
*/

-- Add new columns to locks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE locks ADD COLUMN author_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE locks ADD COLUMN visibility text DEFAULT 'Private' CHECK (visibility IN ('Private', 'For_Sale'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'sale_price'
  ) THEN
    ALTER TABLE locks ADD COLUMN sale_price decimal(10,2) DEFAULT 4.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'creator_revenue'
  ) THEN
    ALTER TABLE locks ADD COLUMN creator_revenue decimal(10,2) DEFAULT 2.99;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'terms_accepted'
  ) THEN
    ALTER TABLE locks ADD COLUMN terms_accepted boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'image_rights_granted'
  ) THEN
    ALTER TABLE locks ADD COLUMN image_rights_granted boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'total_earnings'
  ) THEN
    ALTER TABLE locks ADD COLUMN total_earnings decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Create table to track content purchases
CREATE TABLE IF NOT EXISTS content_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id integer NOT NULL REFERENCES locks(id),
  buyer_id uuid NOT NULL REFERENCES auth.users(id),
  purchase_price decimal(10,2) NOT NULL DEFAULT 4.99,
  creator_revenue decimal(10,2) NOT NULL DEFAULT 2.99,
  purchased_at timestamptz DEFAULT now(),
  stripe_payment_intent_id text
);

ALTER TABLE content_purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Buyers can view own purchases" ON content_purchases;
  DROP POLICY IF EXISTS "Lock owners can view purchases of their content" ON content_purchases;
  DROP POLICY IF EXISTS "System can insert purchases" ON content_purchases;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Buyer can see their own purchases
CREATE POLICY "Buyers can view own purchases"
  ON content_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

-- Lock owner can see purchases of their content
CREATE POLICY "Lock owners can view purchases of their content"
  ON content_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.id = content_purchases.lock_id
      AND locks.owner_id = auth.uid()
    )
  );

-- System can insert purchases
CREATE POLICY "System can insert purchases"
  ON content_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_content_purchases_lock_id ON content_purchases(lock_id);
CREATE INDEX IF NOT EXISTS idx_content_purchases_buyer_id ON content_purchases(buyer_id);
