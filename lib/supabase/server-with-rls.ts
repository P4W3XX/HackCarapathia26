import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Enhanced Supabase server client with RLS session context support.
 * 
 * This wrapper automatically sets the app.current_session_id context
 * variable before queries, enabling RLS policies to match on session_id.
 */

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Expect NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Sets the RLS session context for subsequent queries.
 * 
 * MUST be called before each query when using the anon key.
 * When using SERVICE_ROLE_KEY, RLS is bypassed, so this is optional.
 * 
 * @param supabase - Supabase client instance
 * @param sessionId - The session_id from the user's cookie
 */
export async function setRLSSessionContext(
  supabase: ReturnType<typeof getSupabaseServer>,
  sessionId: string,
) {
  // Set the app.current_session_id config that RLS policies check
  await supabase.rpc("set_app_session_id", { session_id: sessionId })
}

/**
 * Alternative: If you prefer not to use an RPC function, you can manually
 * set the context using raw SQL. Uncomment below and use instead of setRLSSessionContext.
 */
/*
export async function setRLSSessionContextSQL(
  supabase: ReturnType<typeof getSupabaseServer>,
  sessionId: string,
) {
  await supabase.rpc("execute_sql", {
    sql: `SELECT set_config('app.current_session_id', '${sessionId}', false);`,
  })
}
*/
