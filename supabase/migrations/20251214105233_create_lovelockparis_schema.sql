/*
  # LoveLockParis Database Schema

  ## Overview
  Complete database schema for the LoveLockParis virtual love lock platform.
  
  ## New Tables
  
  ### 1. users
  Extended user profile with wallet functionality
  - id (uuid, primary key) - Links to auth.users
  - email (text, unique) - User email address
  - solde_wallet (decimal) - User wallet balance for resale transactions
  - role (text) - User role: user or admin
  - created_at (timestamptz) - Account creation timestamp
  - updated_at (timestamptz) - Last update timestamp
  
  ### 2. locks
  Virtual love locks with strict 1 million ID limit
  - id (integer, primary key) - Lock ID (1 to 1,000,000 strictly)
  - owner_id (uuid, foreign key) - References users(id)
  - zone (text) - Lock zone: Standard, Premium_Eiffel, or Sky_Balloon
  - skin (text) - Lock appearance: Iron, Gold, Diamond, or Ruby
  - content_text (text) - User message on the lock
  - content_media_url (text) - URL to photo/video/audio content
  - status (text) - Lock status: Active, For_Sale, or Broken_Heart
  - locked_at (timestamptz) - When the lock was placed
  - views_count (integer) - Popularity counter for rankings
  - price (decimal) - Purchase price (for resale tracking)
  - created_at (timestamptz) - Record creation timestamp
  
  ### 3. transactions
  Complete transaction history for purchases and resales
  - id (uuid, primary key) - Transaction identifier
  - lock_id (integer, foreign key) - References locks(id)
  - buyer_id (uuid, foreign key) - References users(id)
  - seller_id (uuid, foreign key, nullable) - References users(id) for resales
  - transaction_type (text) - purchase or resale
  - amount (decimal) - Transaction amount
  - platform_commission (decimal) - Platform 30% commission for resales
  - created_at (timestamptz) - Transaction timestamp
  
  ## Security
  - RLS enabled on all tables
  - Users can only read/update their own data
  - Lock owners can update their own locks
  - Admins have special privileges
  - Transaction history is read-only for users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  solde_wallet decimal(10,2) DEFAULT 0.00,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create locks table with strict 1 million limit
CREATE TABLE IF NOT EXISTS locks (
  id integer PRIMARY KEY CHECK (id >= 1 AND id <= 1000000),
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  zone text NOT NULL CHECK (zone IN ('Standard', 'Premium_Eiffel', 'Sky_Balloon')),
  skin text NOT NULL CHECK (skin IN ('Iron', 'Gold', 'Diamond', 'Ruby')),
  content_text text,
  content_media_url text,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'For_Sale', 'Broken_Heart')),
  locked_at timestamptz DEFAULT now(),
  views_count integer DEFAULT 0,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id integer REFERENCES locks(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES users(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'resale')),
  amount decimal(10,2) NOT NULL,
  platform_commission decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locks_owner ON locks(owner_id);
CREATE INDEX IF NOT EXISTS idx_locks_status ON locks(status);
CREATE INDEX IF NOT EXISTS idx_locks_zone ON locks(zone);
CREATE INDEX IF NOT EXISTS idx_locks_views ON locks(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_lock ON transactions(lock_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Locks policies
CREATE POLICY "Anyone can view active locks"
  ON locks FOR SELECT
  TO authenticated
  USING (status IN ('Active', 'For_Sale'));

CREATE POLICY "Lock owners can view their locks"
  ON locks FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Lock owners can update their locks"
  ON locks FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create locks"
  ON locks FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can view all locks"
  ON locks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Transactions policies
CREATE POLICY "Users can view their purchase transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment views counter
CREATE OR REPLACE FUNCTION increment_lock_views(lock_id_param integer)
RETURNS void AS $$
BEGIN
  UPDATE locks
  SET views_count = views_count + 1
  WHERE id = lock_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;