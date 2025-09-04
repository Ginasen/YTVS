-- SQL script to update the handle_new_user trigger function
-- This makes phone_number insertion optional and handles NULL values properly

-- Drop and recreate the trigger function with improved logic
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
begin
  -- Insert into profiles table with COALESCE to handle NULL values
  insert into public.profiles (id, full_name, phone_number)
  values (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone_number'  -- This can be NULL
  );
  return new;
end;
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function (optional)
-- SELECT public.handle_new_user();
