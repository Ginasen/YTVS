import { createClient } from "@supabase/supabase-js"

// Function to create a Supabase client
export const createSupabaseClient = () => {
  // Try to get environment variables - check multiple sources
  const supabaseUrl = typeof process !== 'undefined' 
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : (window as any).env?.NEXT_PUBLIC_SUPABASE_URL || null
  
  const supabaseAnonKey = typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : (window as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || null

  // Fallback to direct access if needed
  if ((!supabaseUrl || !supabaseAnonKey) && typeof window !== 'undefined') {
    // In browser, try to access directly from process.env if available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase URL or Anon Key environment variables.")
    console.log("Available env vars:", {
      url: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'client-side',
      key: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'client-side'
    })
    return null
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    return client
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}

// Don't create a static instance - always create when needed
export const supabase = null
