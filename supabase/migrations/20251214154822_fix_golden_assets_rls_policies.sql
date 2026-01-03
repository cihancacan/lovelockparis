/*
  # Fix Golden Assets RLS Policies

  1. Security Changes
    - Add RLS policies for golden_assets table to allow admins to manage them
    - Allow super_admin and admin users to:
      - View all golden assets (SELECT)
      - Create new golden asset reservations (INSERT)
      - Update existing golden assets (UPDATE)
      - Delete golden assets (DELETE)
    
  2. Important Notes
    - Only authenticated users with admin or super_admin role can access golden_assets
    - This ensures proper access control for premium number management
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can insert golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can update golden assets" ON golden_assets;
DROP POLICY IF EXISTS "Admins can delete golden assets" ON golden_assets;

-- Allow admins to view all golden assets
CREATE POLICY "Admins can view golden assets"
  ON golden_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to insert golden assets
CREATE POLICY "Admins can insert golden assets"
  ON golden_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to update golden assets
CREATE POLICY "Admins can update golden assets"
  ON golden_assets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Allow admins to delete golden assets
CREATE POLICY "Admins can delete golden assets"
  ON golden_assets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );