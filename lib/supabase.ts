import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Create a singleton instance for better performance
let supabaseInstance: SupabaseClient | null = null;

// Function to create a Supabase client
export const createSupabaseClient = (): SupabaseClient | null => {
  console.log("[SUPABASE-LIB] Starting client creation...");
  
  try {
    // Try to get environment variables - check multiple sources
    let supabaseUrl: string | undefined, supabaseAnonKey: string | undefined;
    
    // Check process.env (works in both server and client)
    if (typeof process !== 'undefined' && process.env) {
      supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      console.log("[SUPABASE-LIB] From process.env:", { 
        supabaseUrl: supabaseUrl ? '✅ Found' : '❌ Missing',
        supabaseAnonKey: supabaseAnonKey ? '✅ Found' : '❌ Missing',
        urlPreview: supabaseUrl ? supabaseUrl.substring(0, 50) + "..." : 'N/A'
      });
    }
    
    // Basic validation
    if (!supabaseUrl || !supabaseAnonKey) {
      const error = new Error("Missing Supabase environment variables");
      console.warn("⚠️ Missing Supabase environment variables:");
      console.warn("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Found" : "❌ Missing");
      throw error;
    }

    console.log("[SUPABASE-LIB] Creating client with URL:", supabaseUrl.substring(0, 50) + "...");
    const client = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test the client connection
    console.log("[SUPABASE-LIB] Testing client connectivity...");
    client.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.warn("[SUPABASE-LIB] Client connectivity test failed:", error.message);
      } else {
        console.log("[SUPABASE-LIB] Client connectivity test successful");
      }
    }).catch((testError) => {
      console.warn("[SUPABASE-LIB] Client connectivity test error:", testError);
    });
    
    console.log("✅ Supabase client initialized successfully");
    return client;
  } catch (error: any) {
    console.error("❌ Failed to initialize Supabase client:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return null;
  }
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    console.log("[SUPABASE-LIB] Creating new singleton instance...");
    supabaseInstance = createSupabaseClient();
  } else {
    console.log("[SUPABASE-LIB] Reusing existing singleton instance...");
  }
  return supabaseInstance;
};
