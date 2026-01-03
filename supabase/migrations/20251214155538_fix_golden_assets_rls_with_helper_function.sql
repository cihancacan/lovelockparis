/*
  # Fix Golden Assets RLS Using Helper Function

  1. Changes
    - Update is_admin() helper function to include super_admin role
    - Drop and recreate golden_assets policies using the is_admin() helper
    - Drop and recreate locks update policy using the is_admin() helper
    
  2. Security
    - Using SECURITY DEFINER helper function avoids RLS recursion issues
    - Admins and super_admins can manage golden assets
    - Admins and super_admins can update any lock
*/

-- Update the is_admin helper function to include super_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing golden_assets policies
DROP POLICY IF EXISTS "Admins can view golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can insert golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can update golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can delete golden assets" ON golden_assets;

-- Recreate golden_assets policies using helper function
CREATE POLICY "Admins can view golden assets"
  ON golden_assets
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert golden assets"
  ON golden_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update golden assets"
  ON golden_assets
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete golden assets"
  ON golden_assets
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Drop and recreate locks update policy using helper function
DROP POLICY IF EXISTS "Admins can update any lock" ON locks;

CREATE POLICY "Admins can update any lock"
  ON locks
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());