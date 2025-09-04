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

  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (signUpError) {
      console.error('Registration failed:', signUpError.message);
      console.error('Error details:', signUpError);
      return;
    }

    if (authData.user) {
      console.log('User created in auth.users:', authData.user.id);
      console.log('Registration test successful! Profile should be created by a trigger.');
      
      // Try to check if profile was created
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile check failed:', profileError.message);
        } else {
          console.log('Profile found:', profileData);
        }
      } catch (profileCheckError) {
        console.error('Profile check error:', profileCheckError);
      }
    } else {
      console.error('Registration failed: No user data returned.');
    }
  } catch (error) {
    console.error('Registration failed with exception:', error);
    console.error('Error details:', error);
  }
}

testRegistration();
