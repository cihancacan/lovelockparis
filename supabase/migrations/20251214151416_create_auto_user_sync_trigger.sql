/*
  # Create Auto User Sync Trigger

  This migration creates a trigger that automatically syncs users from auth.users to public.users
  when a new user signs up.

  1. Functions
    - `handle_new_user()` - Triggered function that creates a public.users entry when a new auth.users entry is created

  2. Triggers
    - `on_auth_user_created` - Trigger on auth.users table that calls handle_new_user()

  3. Backfill
    - Insert existing auth.users into public.users if they don't exist
*/

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users from auth.users to public.users
INSERT INTO public.users (id, email, role, created_at)
SELECT 
  id,
  email,
  'user',
  created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  updated_at = now();

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a public.users entry when a new auth.users entry is created';
