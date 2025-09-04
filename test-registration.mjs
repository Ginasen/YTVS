import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistration() {
  const email = `testuser_${Date.now()}@ginasen.ru`;
  const password = 'Password123!';
  const name = 'Test User';
  const phone = '1234567890';

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone_number: phone,
      },
    },
  });

  if (signUpError) {
    console.error('Registration failed:', signUpError.message);
    return;
  }

  if (authData.user) {
    console.log('User created in auth.users:', authData.user.id);
    console.log('Registration test successful! Profile should be created by a trigger.');
  } else {
    console.error('Registration failed: No user data returned.');
  }
}

testRegistration();
