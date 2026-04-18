import { getOrCreateGameState } from "@/lib/game-actions"
import { RentalScanner } from "@/components/game/rental-scanner"

export const dynamic = "force-dynamic"

export default async function RentalPage() {
  const state = await getOrCreateGameState()
  return <RentalScanner initialState={state} />
}
