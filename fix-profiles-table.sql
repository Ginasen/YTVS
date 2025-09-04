-- SQL script to fix the profiles table to match the handle_new_user trigger function
-- This script adds the missing phone_number column to the profiles table

-- Add the phone_number column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN public.profiles.phone_number IS 'User phone number (optional)';

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles' 
ORDER BY ordinal_position;

-- Test the trigger by creating a test user (you can run this part separately to verify)
-- SELECT auth.email_change('test@example.com', 'Password123!', '{"full_name": "Test User", "phone_number": "1234567890"}'::jsonb);
