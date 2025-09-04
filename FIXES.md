# Fixes for Supabase Registration Issues

## Problem Description

The registration is failing with "Ошибка инициализации клиента Supabase" (Supabase client initialization error), but the real issue is a database error caused by a mismatch between the `handle_new_user` trigger function and the `profiles` table structure.

## Root Cause Analysis

1. **Client Initialization**: Fixed in `lib/supabase.ts` and `app/register/page.tsx` by implementing proper singleton pattern and error handling
2. **Database Error**: The `handle_new_user` trigger function tries to insert a `phone_number` column that doesn't exist in the `profiles` table
3. **Manual Profile Creation**: Removed manual profile insertion from registration page since it's handled by the trigger

## Fixes Applied

### 1. Client Initialization Fix
- Updated `lib/supabase.ts` to use proper TypeScript typing and singleton pattern
- Updated `app/register/page.tsx` to use `getSupabaseClient()` instead of `createSupabaseClient()`
- Added better error handling and logging

### 2. Registration Logic Fix
- Removed manual profile insertion from registration page
- Let the trigger function handle profile creation automatically
- Removed phone number from user metadata to avoid conflicts

### 3. Test Script Fix
- Updated `test-registration.mjs` to match the new registration logic
- Removed phone number from test data

## Database Fix (Manual Step Required)

Since the Supabase MCP server is in read-only mode, you need to manually run the following SQL to fix the database schema mismatch:

### Option 1: Add Missing Column (Recommended)
Run the SQL script `fix-profiles-table.sql` in your Supabase SQL editor:

```sql
-- Add the phone_number column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN public.profiles.phone_number IS 'User phone number (optional)';
```

### Option 2: Fix the Trigger Function (Alternative)
If you prefer to modify the trigger function instead, you can update it to match the current table structure:

```sql
-- Drop and recreate the trigger function without phone_number
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Testing

After applying the database fix, test the registration:

```bash
node test-registration.mjs
```

The registration should now work without errors.

## Additional Security Recommendations

Based on the Supabase advisor warnings, consider implementing:

1. **Enable Leaked Password Protection** in Supabase Auth settings
2. **Fix RLS Policy** for better performance:
   ```sql
   DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
   CREATE POLICY "Users can view their own profile." ON public.profiles 
   FOR SELECT USING ( (SELECT auth.uid()) = id );
   ```

## Files Modified

- `lib/supabase.ts` - Improved client initialization
- `app/register/page.tsx` - Fixed client usage and removed manual profile insertion
- `test-registration.mjs` - Updated test script
- `fix-profiles-table.sql` - Database migration script
