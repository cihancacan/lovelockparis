/*
  # Fix RLS Infinite Recursion for Users Table

  This migration fixes the infinite recursion issue in RLS policies by:
  1. Dropping the problematic admin policies that query the users table
  2. Creating a helper function with SECURITY DEFINER to check admin role
  3. Recreating the admin policies using the helper function

  ## Changes
  - Drop existing admin policies for users, locks, and transactions
  - Create is_admin() function with SECURITY DEFINER
  - Recreate admin policies using the helper function
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can view all locks" ON locks;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies using the helper function
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all locks"
  ON locks FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (is_admin());