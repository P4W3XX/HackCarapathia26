"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import {
  type Delta,
  type GameEvent,
  type GameState,
  type ModuleId,
  STAT_CAPS,
} from "@/lib/game-types"

const COOKIE_NAME = "adulting_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function generateSessionId() {
  // URL-safe random id
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10)
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies()
  const existing = jar.get(COOKIE_NAME)?.value
  if (existing) return existing
  const fresh = generateSessionId()
  jar.set(COOKIE_NAME, fresh, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
  return fresh
}

async function readSessionId(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(COOKIE_NAME)?.value ?? null
}

export async function startNewGame(): Promise<void> {
  const jar = await cookies()
  const sessionId = generateSessionId()
  jar.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })

  const supabase = getSupabaseServer()
  const { error } = await supabase.from("game_sessions").insert({
    session_id: sessionId,
    cash: 3200,
    health: 80,
    stress: 20,
    knowledge: 0,
    current_module: null,
    completed_modules: [],
  })
  if (error) {
    console.log("[v0] startNewGame insert error:", error.message)
    throw new Error("Could not start a new game. Try again.")
  }

  redirect("/dashboard")
}

export async function resetGame(): Promise<void> {
  const sessionId = await readSessionId()
  if (!sessionId) {
    await startNewGame()
    return
  }
  const supabase = getSupabaseServer()
  await supabase.from("game_events").delete().eq("session_id", sessionId)
  await supabase
    .from("game_sessions")
    .update({
      cash: 3200,
      health: 80,
      stress: 20,
      knowledge: 0,
      current_module: null,
      completed_modules: [],
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId)
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function getOrCreateGameState(): Promise<GameState> {
  const sessionId = await getOrCreateSessionId()
  const supabase = getSupabaseServer()

  const { data: existing } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle()

  if (existing) {
    return {
      sessionId,
      cash: existing.cash,
      health: existing.health,
      stress: existing.stress,
      knowledge: existing.knowledge,
      currentModule: (existing.current_module as ModuleId) ?? null,
      completedModules: (existing.completed_modules as ModuleId[]) ?? [],
    }
  }

  // Insert fresh row for a new cookie
  const { error } = await supabase.from("game_sessions").insert({
    session_id: sessionId,
    cash: 3200,
    health: 80,
    stress: 20,
    knowledge: 0,
    current_module: null,
    completed_modules: [],
  })
  if (error) {
    console.log("[v0] getOrCreateGameState insert error:", error.message)
  }

  return {
    sessionId,
    cash: 3200,
    health: 80,
    stress: 20,
    knowledge: 0,
    currentModule: null,
    completedModules: [],
  }
}

export async function applyChoice(args: {
  module: ModuleId
  eventType: string
  title: string
  description?: string
  delta: Delta
}): Promise<GameState> {
  const state = await getOrCreateGameState()
  const supabase = getSupabaseServer()

  const next: GameState = {
    ...state,
    cash: Math.max(-99999, state.cash + (args.delta.cash ?? 0)),
    health: clamp(state.health + (args.delta.health ?? 0), 0, STAT_CAPS.health),
    stress: clamp(state.stress + (args.delta.stress ?? 0), 0, STAT_CAPS.stress),
    knowledge: clamp(
      state.knowledge + (args.delta.knowledge ?? 0),
      0,
      STAT_CAPS.knowledge,
    ),
  }

  await supabase
    .from("game_sessions")
    .update({
      cash: next.cash,
      health: next.health,
      stress: next.stress,
      knowledge: next.knowledge,
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", state.sessionId)

  await supabase.from("game_events").insert({
    session_id: state.sessionId,
    module: args.module,
    event_type: args.eventType,
    title: args.title,
    description: args.description ?? null,
    cash_delta: args.delta.cash ?? 0,
    health_delta: args.delta.health ?? 0,
    stress_delta: args.delta.stress ?? 0,
    knowledge_delta: args.delta.knowledge ?? 0,
  })

  revalidatePath("/dashboard")
  return next
}

export async function completeModule(moduleId: ModuleId): Promise<void> {
  const state = await getOrCreateGameState()
  const supabase = getSupabaseServer()

  const completed = Array.from(new Set([...state.completedModules, moduleId]))

  await supabase
    .from("game_sessions")
    .update({
      completed_modules: completed,
      current_module: null,
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", state.sessionId)

  revalidatePath("/dashboard")
}

export async function getEventHistory(limit = 20): Promise<GameEvent[]> {
  const sessionId = await readSessionId()
  if (!sessionId) return []
  const supabase = getSupabaseServer()

  const { data, error } = await supabase
    .from("game_events")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    module: row.module as ModuleId | "meta",
    eventType: row.event_type,
    title: row.title,
    description: row.description,
    cashDelta: row.cash_delta ?? 0,
    healthDelta: row.health_delta ?? 0,
    stressDelta: row.stress_delta ?? 0,
    knowledgeDelta: row.knowledge_delta ?? 0,
    createdAt: row.created_at,
  }))
}
