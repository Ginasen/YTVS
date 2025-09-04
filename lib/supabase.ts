import { createClient } from "@supabase/supabase-js"

// Function to create a Supabase client
export const createSupabaseClient = () => {
  console.log("[SUPABASE-LIB] Starting client creation...")
  
  try {
    // Try to get environment variables - check multiple sources
    let supabaseUrl, supabaseAnonKey;
    
    // Check process.env (works in both server and client)
    if (typeof process !== 'undefined' && process.env) {
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      console.log("[SUPABASE-LIB] From process.env:", { supabaseUrl: supabaseUrl ? '✅ Found' : '❌ Missing', supabaseAnonKey: supabaseAnonKey ? '✅ Found' : '❌ Missing' });
    }
    
    // Basic validation
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("⚠️ Missing Supabase environment variables:")
      console.warn("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing")
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing")
      return null
    }

    console.log("[SUPABASE-LIB] Creating client with URL:", supabaseUrl.substring(0, 50) + "...")
    const client = createClient(supabaseUrl, supabaseAnonKey)
    console.log("✅ Supabase client initialized successfully")
    return client
  } catch (error: any) {
    console.error("❌ Failed to initialize Supabase client:", error)
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return null
  }
}

// Don't create a static instance - always create when needed
export const supabase = null
