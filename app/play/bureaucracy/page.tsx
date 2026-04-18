import { getOrCreateGameState } from "@/lib/game-actions"
import { SceneRunner } from "@/components/game/scene-runner"
import { BUREAUCRACY_SCENES } from "@/lib/scenarios/bureaucracy"

export const dynamic = "force-dynamic"

export default async function BureaucracyPage() {
  const state = await getOrCreateGameState()
  return (
    <SceneRunner
      module="bureaucracy"
      title="Chapter 03 — Sick Day Sim"
      scenes={BUREAUCRACY_SCENES}
      initialState={state}
    />
  )
}
