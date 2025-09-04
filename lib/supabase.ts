import { createClient } from "@supabase/supabase-js"

// Function to create a Supabase client
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase URL or Anon Key environment variables. Returning null client.")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a client instance
export const supabase = createSupabaseClient()
