import { NextResponse } from "next/server"

export async function GET() {
  console.log("[TEST-ENV] Checking environment variables...")
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log("[TEST-ENV] Environment variables:")
  console.log("  NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ Undefined')
  console.log("  NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : '❌ Undefined')
  
  return NextResponse.json({
    supabaseUrl: supabaseUrl ? '✅ Found' : '❌ Missing',
    supabaseAnonKey: supabaseAnonKey ? '✅ Found' : '❌ Missing',
    supabaseUrlValue: supabaseUrl ? `${supabaseUrl.substring(0, 50)}...` : null,
    supabaseAnonKeyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : null,
  })
}
