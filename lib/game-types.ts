export type ModuleId = "paycheck" | "rental" | "bureaucracy"

export type GameState = {
  sessionId: string
  cash: number
  health: number
  stress: number
  knowledge: number
  currentModule: ModuleId | null
  completedModules: ModuleId[]
}

export type Delta = {
  cash?: number
  health?: number
  stress?: number
  knowledge?: number
}

export type GameEvent = {
  id: string
  module: ModuleId | "meta"
  eventType: string
  title: string
  description: string | null
  cashDelta: number
  healthDelta: number
  stressDelta: number
  knowledgeDelta: number
  createdAt: string
}

export const MODULE_META: Record<
  ModuleId,
  { title: string; tagline: string; order: number }
> = {
  paycheck: {
    title: "First Paycheck",
    tagline: "3,200 landed. Don't blow it all on takeout.",
    order: 1,
  },
  rental: {
    title: "Rental Red Flags",
    tagline: "Sign the lease — or spot the scam?",
    order: 2,
  },
  bureaucracy: {
    title: "Sick Day Sim",
    tagline: "e-ZLA, NFZ, and your angry boss.",
    order: 3,
  },
}

export const STAT_CAPS = {
  health: 100,
  stress: 100,
  knowledge: 100,
}
