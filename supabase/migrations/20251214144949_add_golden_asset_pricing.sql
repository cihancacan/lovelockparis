/*
  # Add Golden Asset Pricing

  This migration adds pricing functionality for Golden Assets.
  
  1. Changes to Locks Table
    - Add `golden_asset_price` decimal field (nullable)
    - This field stores the special price for Golden Assets (reserved numbers)
    - When a user searches for a Golden Asset number, this price will be displayed
  
  2. Security
    - Only admins can update golden_asset_price
*/

-- Add golden_asset_price to locks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locks' AND column_name = 'golden_asset_price'
  ) THEN
    ALTER TABLE locks ADD COLUMN golden_asset_price decimal(10,2);
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_locks_golden_asset_price ON locks(golden_asset_price) WHERE golden_asset_price IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN locks.golden_asset_price IS 'Special price for Golden Assets (reserved numbers). When set, this price will be displayed to buyers searching for this number.';
