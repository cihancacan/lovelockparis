/*
  # Fix Ghost Protocol and Add Resale System

  ## Ghost Protocol Fix
  - Add policy to allow admins to insert ghost locks without owner_id

  ## Super Admin and Resale System
  
  1. Changes to Users Table
    - Add `is_super_admin` boolean field (default false)
    - Only super admins can promote other users to admin
  
  2. Changes to Locks Table
    - Add `resale_price` decimal field (nullable)
    - When set, indicates the owner is willing to sell at this price
    - Add `is_for_sale` boolean computed from resale_price
  
  3. New Table: buy_offers
    - `id` (uuid, primary key)
    - `lock_id` (integer, foreign key to locks)
    - `buyer_id` (uuid, foreign key to users) - person making offer
    - `offer_price` (decimal) - offered amount
    - `message` (text, optional) - message to current owner
    - `status` (text) - pending, accepted, rejected, cancelled
    - `created_at` (timestamptz)
    - `responded_at` (timestamptz, nullable)
  
  4. Security
    - Enable RLS on buy_offers table
    - Admins can create ghost locks (owner_id = NULL)
    - Lock owners can view/manage offers on their locks
    - Buyers can view their own offers
    - Admins can view all offers
*/

-- Add is_super_admin to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE users ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- Add resale_price to locks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'resale_price'
  ) THEN
    ALTER TABLE locks ADD COLUMN resale_price decimal(10,2);
  END IF;
END $$;

-- Create buy_offers table
CREATE TABLE IF NOT EXISTS buy_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id integer NOT NULL REFERENCES locks(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offer_price decimal(10,2) NOT NULL CHECK (offer_price > 0),
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Enable RLS on buy_offers
ALTER TABLE buy_offers ENABLE ROW LEVEL SECURITY;

-- Drop existing admin insert policy if exists (to replace it)
DROP POLICY IF EXISTS "Admins can insert ghost locks" ON locks;

-- Allow admins to insert locks without owner_id (for Ghost Protocol)
CREATE POLICY "Admins can insert any locks"
  ON locks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Buy Offers RLS Policies

CREATE POLICY "Lock owners can view offers on their locks"
  ON buy_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.id = buy_offers.lock_id
      AND locks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view their own offers"
  ON buy_offers FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Admins can view all offers"
  ON buy_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create offers"
  ON buy_offers FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Lock owners can update offers on their locks"
  ON buy_offers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.id = buy_offers.lock_id
      AND locks.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM locks
      WHERE locks.id = buy_offers.lock_id
      AND locks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can update their own offers"
  ON buy_offers FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_buy_offers_lock_id ON buy_offers(lock_id);
CREATE INDEX IF NOT EXISTS idx_buy_offers_buyer_id ON buy_offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buy_offers_status ON buy_offers(status);
CREATE INDEX IF NOT EXISTS idx_locks_resale_price ON locks(resale_price) WHERE resale_price IS NOT NULL;
