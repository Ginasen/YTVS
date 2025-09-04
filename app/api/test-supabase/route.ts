import { NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"

export async function GET() {
  console.log("[TEST-SUPABASE-API] Starting Supabase client test...")
  
  try {
    console.log("[TEST-SUPABASE-API] typeof createSupabaseClient:", typeof createSupabaseClient)
    
    if (typeof createSupabaseClient !== 'function') {
      console.error("[TEST-SUPABASE-API] createSupabaseClient is not a function!")
      return NextResponse.json({
        success: false,
        error: "createSupabaseClient is not a function",
        type: typeof createSupabaseClient
      })
    }
    
    const supabase = createSupabaseClient()
    console.log("[TEST-SUPABASE-API] createSupabaseClient returned:", supabase)
    
    if (!supabase) {
      console.error("[TEST-SUPABASE-API] Supabase client is null!")
      return NextResponse.json({
        success: false,
        error: "Supabase client is null"
      })
    }
    
    // Test basic connectivity by trying to access a simple table
    console.log("[TEST-SUPABASE-API] Testing basic connectivity...")
    const { data, error } = await supabase.from("profiles").select("*").limit(1)
    
    if (error) {
      console.error("[TEST-SUPABASE-API] Connectivity test failed:", error)
      return NextResponse.json({
        success: false,
        error: `Connectivity test failed: ${error.message}`,
        errorCode: error.code
      })
    }
    
    console.log("[TEST-SUPABASE-API] Connectivity test successful!")
    return NextResponse.json({
      success: true,
      message: "Supabase client initialized and connected successfully!",
      testData: data
    })
  } catch (error: any) {
    console.error("[TEST-SUPABASE-API] Unexpected error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
