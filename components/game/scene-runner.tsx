"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { ScenarioCard, type Choice } from "@/components/game/scenario-card"
import { Hud } from "@/components/game/hud"
import { Button } from "@/components/ui/button"
import type { GameState, ModuleId } from "@/lib/game-types"
import type { Scene } from "@/lib/scenarios/paycheck"
import { applyChoice, completeModule } from "@/lib/game-actions"

export function SceneRunner({
  module,
  title,
  scenes,
  initialState,
}: {
  module: ModuleId
  title: string
  scenes: Scene[]
  initialState: GameState
}) {
  const router = useRouter()
  const [state, setState] = useState<GameState>(initialState)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [lastOutcome, setLastOutcome] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [finished, setFinished] = useState(false)

  const scene = scenes[sceneIdx]
  const isLast = sceneIdx >= scenes.length - 1

  function handleChoose(choice: Choice) {
    if (pending || picked) return
    setPicked(choice.id)
    setLastOutcome(choice.outcome)

    startTransition(async () => {
      const next = await applyChoice({
        module,
        eventType: `${scene.id}:${choice.id}`,
        title: `${scene.title} — ${choice.label}`,
        description: choice.outcome,
        delta: choice.delta,
      })
      setState(next)
    })
  }

  function handleNext() {
    if (isLast) {
      startTransition(async () => {
        await completeModule(module)
        setFinished(true)
      })
      return
    }
    setPicked(null)
    setLastOutcome(null)
    setSceneIdx((i) => i + 1)
  }

  return (
    <div className="min-h-screen pb-20">
      <Hud state={state} title={title} />

      <main className="mx-auto max-w-3xl px-4 pt-8 md:pt-12">
        {/* Progress dots */}
        <div className="mb-6 flex items-center gap-1.5">
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < sceneIdx
                  ? "bg-primary"
                  : i === sceneIdx
                    ? "bg-primary/60"
                    : "bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-8 text-center"
            >
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance">
                  Chapter cleared.
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Your stats updated. Your story just got one chapter longer.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => router.push("/dashboard")}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Back to dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={scene.id}>
              <ScenarioCard
                chapter={scene.chapter}
                title={scene.title}
                narration={scene.narration}
                choices={scene.choices}
                onChoose={handleChoose}
                disabled={pending || !!picked}
                lastPicked={lastOutcome}
              />

              {picked && !pending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-end"
                >
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLast ? "Finish chapter" : "Next scene"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
