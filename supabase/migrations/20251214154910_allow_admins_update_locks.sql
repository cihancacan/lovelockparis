/*
  # Allow Admins to Update Locks

  1. Security Changes
    - Add UPDATE policy for locks table to allow admins to modify any lock
    - This is needed for admins to set golden_asset_price on locks
    - Admins and super_admins can update any lock field
    
  2. Important Notes
    - This policy works alongside the existing "Lock owners can update their locks" policy
    - Both policies will be evaluated (OR logic), so either the user is the owner OR an admin
*/

-- Drop existing admin update policy if it exists
DROP POLICY IF EXISTS "Admins can update any lock" ON locks;

-- Allow admins to update any lock
CREATE POLICY "Admins can update any lock"
  ON locks
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