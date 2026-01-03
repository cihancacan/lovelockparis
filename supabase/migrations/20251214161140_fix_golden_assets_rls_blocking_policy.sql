/*
  # Fix Golden Assets RLS Blocking Policy

  1. Changes
    - Drop the restrictive "Only service role can manage golden assets" policy that blocks all operations
    - This policy was preventing admins from inserting/updating golden asset prices
    - The existing admin-specific policies (insert, update, delete, select) will handle authorization correctly

  2. Security
    - Admins can still manage golden assets through the specific admin policies
    - Authenticated users can view golden assets
    - No open access - all operations still require proper authentication and admin check
*/

DROP POLICY IF EXISTS "Only service role can manage golden assets" ON golden_assets;
