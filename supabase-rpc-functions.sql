-- ============================================================================
-- RPC Function for Setting RLS Session Context
-- ============================================================================
-- 
-- Execute this in Supabase SQL Editor to create a helper function
-- that sets the app.current_session_id config variable.
-- 
-- This allows the Supabase client to set RLS context before queries.
-- ============================================================================

CREATE OR REPLACE FUNCTION set_app_session_id(session_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_session_id', session_id, false);
END;
$$;

-- Grant execution to anon and authenticated users
GRANT EXECUTE ON FUNCTION set_app_session_id(TEXT) TO anon, authenticated;

-- ============================================================================
-- Alternative: For the browser client (anon key)
-- 
-- If using the browser client with anon key, you might need a slightly
-- different approach. You can create a table-returning function instead:
-- ============================================================================

CREATE OR REPLACE FUNCTION get_game_state_with_context(p_session_id TEXT)
RETURNS TABLE (
  session_id TEXT,
  cash INT,
  health INT,
  stress INT,
  knowledge INT,
  current_module TEXT,
  completed_modules TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.current_session_id', p_session_id, false);
  
  RETURN QUERY
  SELECT 
    game_sessions.session_id,
    game_sessions.cash,
    game_sessions.health,
    game_sessions.stress,
    game_sessions.knowledge,
    game_sessions.current_module,
    game_sessions.completed_modules,
    game_sessions.created_at,
    game_sessions.updated_at
  FROM public.game_sessions
  WHERE game_sessions.session_id = p_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_game_state_with_context(TEXT) TO anon, authenticated;
