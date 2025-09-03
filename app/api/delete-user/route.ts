import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase URL or Service Role Key environment variables.")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 })
    }

    // Delete user from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting user from auth.users:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // The trigger 'on_auth_user_created' should handle cascading delete to 'profiles' table
    // if foreign key constraint is set up with ON DELETE CASCADE.
    // If not, we would need to manually delete from profiles here.
    // For now, assuming ON DELETE CASCADE is set up or will be handled by the trigger.

    return NextResponse.json({ message: `User ${userId} deleted successfully.` })
  } catch (error: any) {
    console.error("Error in delete-user API:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
