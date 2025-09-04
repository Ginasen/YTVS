"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"

export default function TestSupabasePage() {
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const testSupabaseClient = async () => {
      console.log("[TEST] Starting Supabase client test...")
      
      try {
        console.log("[TEST] typeof createSupabaseClient:", typeof createSupabaseClient)
        
        if (typeof createSupabaseClient !== 'function') {
          throw new Error("createSupabaseClient is not a function")
        }
        
        const supabase = createSupabaseClient()
        console.log("[TEST] createSupabaseClient returned:", supabase)
        
        if (!supabase) {
          throw new Error("Supabase client is null")
        }
        
        // Test basic connectivity
        console.log("[TEST] Testing basic connectivity...")
        const { data, error } = await supabase.from("profiles").select("*").limit(1)
        
        if (error) {
          console.error("[TEST] Connectivity test failed:", error)
          setTestResult(`❌ Connectivity test failed: ${error.message}`)
        } else {
          console.log("[TEST] Connectivity test successful:", data)
          setTestResult("✅ Supabase client initialized and connected successfully!")
        }
      } catch (error: any) {
        console.error("[TEST] Error testing Supabase client:", error)
        setTestResult(`❌ Error: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    testSupabaseClient()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Supabase Client Test</h1>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Testing Supabase client...</p>
          </div>
        ) : (
          <div className={`p-6 rounded-lg ${testResult.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="text-lg font-semibold">{testResult}</p>
          </div>
        )}
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Check browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  )
}
