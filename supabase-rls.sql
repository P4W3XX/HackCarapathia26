-- ============================================================================
-- Row Level Security (RLS) Setup for Adulting Sandbox Game
-- ============================================================================
-- 
-- This sets up RLS policies for game_sessions and game_events tables.
-- Since the app uses cookie-based anonymous sessions (not Supabase Auth),
-- we implement RLS based on session_id matching.
--
-- The session_id is passed via headers from the client/server.
-- ============================================================================

-- ============================================================================
-- 1. Enable RLS on game_sessions table
-- ============================================================================
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own session (INSERT)
CREATE POLICY "Users can create their own game session"
ON public.game_sessions
FOR INSERT
USING (true)
WITH CHECK (true);

-- Allow users to SELECT only their own session (comparing with current_session_id header)
CREATE POLICY "Users can view their own game session"
ON public.game_sessions
FOR SELECT
USING (session_id = current_setting('app.current_session_id', true));

-- Allow users to UPDATE only their own session
CREATE POLICY "Users can update their own game session"
ON public.game_sessions
FOR UPDATE
USING (session_id = current_setting('app.current_session_id', true))
WITH CHECK (session_id = current_setting('app.current_session_id', true));

-- Allow users to DELETE only their own session (optional, for cleanup)
CREATE POLICY "Users can delete their own game session"
ON public.game_sessions
FOR DELETE
USING (session_id = current_setting('app.current_session_id', true));

-- ============================================================================
-- 2. Enable RLS on game_events table
-- ============================================================================
ALTER TABLE public.game_events ENABLE ROW LEVEL SECURITY;

-- Allow users to create events for their own session
CREATE POLICY "Users can create events for their own session"
ON public.game_events
FOR INSERT
USING (true)
WITH CHECK (session_id = current_setting('app.current_session_id', true));

-- Allow users to SELECT only their own events
CREATE POLICY "Users can view their own game events"
ON public.game_events
FOR SELECT
USING (session_id = current_setting('app.current_session_id', true));

-- Allow users to UPDATE their own events (if needed)
CREATE POLICY "Users can update their own game events"
ON public.game_events
FOR UPDATE
USING (session_id = current_setting('app.current_session_id', true))
WITH CHECK (session_id = current_setting('app.current_session_id', true));

-- Allow users to DELETE their own events (if needed)
CREATE POLICY "Users can delete their own game events"
ON public.game_events
FOR DELETE
USING (session_id = current_setting('app.current_session_id', true));

-- ============================================================================
-- IMPORTANT: Helper function to set session context
-- ============================================================================
-- You need to call this BEFORE each query from the client/server:
-- 
-- SELECT set_config('app.current_session_id', 'user-session-id-here', false);
--
-- This can be done in your Supabase client wrapper or before each query.
-- ============================================================================
