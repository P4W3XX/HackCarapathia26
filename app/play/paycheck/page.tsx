import { getOrCreateGameState } from "@/lib/game-actions"
import { SceneRunner } from "@/components/game/scene-runner"
import { PAYCHECK_SCENES } from "@/lib/scenarios/paycheck"

export const dynamic = "force-dynamic"

export default async function PaycheckPage() {
  const state = await getOrCreateGameState()
  return (
    <SceneRunner
      module="paycheck"
      title="Chapter 01 — First Paycheck"
      scenes={PAYCHECK_SCENES}
      initialState={state}
    />
  )
}
