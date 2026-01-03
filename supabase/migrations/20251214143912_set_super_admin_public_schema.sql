/*
  # Set Super Admin in Public Schema

  This migration sets the super admin flag for the main administrator account in the public.users table.
  
  1. Updates
    - Set is_super_admin = true for cacancihan@gmail.com in public.users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

UPDATE public.users
SET is_super_admin = true
WHERE email = 'cacancihan@gmail.com';
