import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Test all environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      RAPIDAPI_KEY: process.env.RAPIDAPI_KEY ? '✅ Set' : '❌ Missing',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT ? '✅ Set' : '❌ Missing',
    };

    // Log the actual values (masked for security)
    console.log('[TEST-ENV] Environment Variables Status:', envVars);
    
    // Log masked versions of the keys for verification
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('[TEST-ENV] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...');
    }
    if (process.env.GEMINI_API_KEY) {
      console.log('[TEST-ENV] Gemini API Key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...' + process.env.GEMINI_API_KEY.slice(-5));
    }

    return NextResponse.json({
      success: true,
      message: "Environment variables configuration verified",
      envVars
    });
  } catch (error: any) {
    console.error('[TEST-ENV] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
