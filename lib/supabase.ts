import { createClient } from "@supabase/supabase-js"

// Function to create a Supabase client
export const createSupabaseClient = () => {
  // Simple approach - just try to get the environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Basic validation
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Missing Supabase environment variables:")
    console.warn("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
    console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing")
    return null
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client initialized successfully")
    return client
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error)
    return null
  }
}

// Don't create a static instance - always create when needed
export const supabase = null
