"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FileSignature,
  Flag,
  ShieldCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Hud } from "@/components/game/hud"
import { cn } from "@/lib/utils"
import type { GameState } from "@/lib/game-types"
import {
  LEASE_CLAUSES,
  REDFLAG_OUTCOMES,
  type LeaseClause,
} from "@/lib/scenarios/rental"
import { applyChoice, completeModule } from "@/lib/game-actions"

export function RentalScanner({ initialState }: { initialState: GameState }) {
  const router = useRouter()
  const [state, setState] = useState<GameState>(initialState)
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()
  const [finished, setFinished] = useState(false)

  function toggle(id: string) {
    if (submitted) return
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const score = (() => {
    const redFlags = LEASE_CLAUSES.filter((c) => c.isRedFlag)
    const correctFlags = redFlags.filter((c) => flagged.has(c.id)).length
    const wrongFlags = LEASE_CLAUSES.filter(
      (c) => !c.isRedFlag && flagged.has(c.id),
    ).length
    const missed = redFlags.length - correctFlags
    return { correctFlags, wrongFlags, missed, total: redFlags.length }
  })()

  const outcomeKey: keyof typeof REDFLAG_OUTCOMES =
    score.correctFlags === score.total && score.wrongFlags === 0
      ? "perfect"
      : score.correctFlags >= score.total - 1 && score.wrongFlags <= 1
        ? "good"
        : "rough"
  const outcome = REDFLAG_OUTCOMES[outcomeKey]

  function handleSubmit() {
    if (pending || submitted) return
    setSubmitted(true)
    startTransition(async () => {
      const next = await applyChoice({
        module: "rental",
        eventType: `scan:${outcomeKey}`,
        title: `Lease scan — ${outcome.title}`,
        description: outcome.body,
        delta: outcome.delta,
      })
      setState(next)
    })
  }

  function handleFinish() {
    startTransition(async () => {
      await completeModule("rental")
      setFinished(true)
    })
  }

  return (
    <div className="min-h-screen pb-20">
      <Hud state={state} title="Chapter 02 — Rental Red Flags" />

      <main className="mx-auto max-w-4xl px-4 pt-8 md:pt-12">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-8 text-center"
            >
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  Lease scanned.
                </h2>
                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="mt-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Back to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                  <FileSignature className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Chapter 02 — Rental Red Flags
                  </p>
                  <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-balance">
                    Scan the lease before you sign.
                  </h1>
                  <p className="mt-2 text-muted-foreground leading-relaxed text-pretty">
                    Tap every clause you think is shady. Some are totally
                    normal — if you flag those, that&apos;s also a miss.
                    When you&apos;re done, submit to see what a real tenant
                    lawyer would say.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="absolute inset-0 scanlines pointer-events-none" />
                <div className="relative p-5 md:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                      Lease Agreement — Draft
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground">
                      {flagged.size} flagged
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {LEASE_CLAUSES.map((clause, idx) => (
                      <ClauseRow
                        key={clause.id}
                        clause={clause}
                        index={idx}
                        flagged={flagged.has(clause.id)}
                        submitted={submitted}
                        onToggle={() => toggle(clause.id)}
                      />
                    ))}
                  </ul>

                  {!submitted && (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={pending}
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Submit review
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 overflow-hidden rounded-2xl border border-primary/40 bg-primary/5 p-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                        Verdict
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight">
                        {outcome.title}
                      </h3>
                      <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                        {outcome.body}
                      </p>
                      <div className="mt-4 grid gap-2 text-sm font-mono tabular-nums sm:grid-cols-3">
                        <Stat label="Caught" value={`${score.correctFlags}/${score.total}`} good />
                        <Stat label="Missed" value={`${score.missed}`} bad={score.missed > 0} />
                        <Stat label="False alarm" value={`${score.wrongFlags}`} bad={score.wrongFlags > 0} />
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button
                          size="lg"
                          onClick={handleFinish}
                          disabled={pending}
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Finish chapter
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function Stat({
  label,
  value,
  good,
  bad,
}: {
  label: string
  value: string
  good?: boolean
  bad?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background/60 px-3 py-2",
        good && "border-primary/40 text-primary",
        bad && "border-destructive/40 text-destructive",
        !good && !bad && "border-border text-foreground",
      )}
    >
      <p className="text-[10px] uppercase tracking-widest opacity-70">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-semibold">{value}</p>
    </div>
  )
}

function ClauseRow({
  clause,
  index,
  flagged,
  submitted,
  onToggle,
}: {
  clause: LeaseClause
  index: number
  flagged: boolean
  submitted: boolean
  onToggle: () => void
}) {
  const correct = submitted && flagged === clause.isRedFlag
  const incorrect = submitted && flagged !== clause.isRedFlag

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        disabled={submitted}
        className={cn(
          "group flex w-full items-start gap-4 rounded-xl border bg-background/60 p-4 text-left transition-all",
          !submitted && "hover:border-primary hover:-translate-y-0.5",
          !submitted && flagged && "border-destructive bg-destructive/5",
          !submitted && !flagged && "border-border",
          submitted && correct && "border-primary/60 bg-primary/5",
          submitted && incorrect && "border-destructive/60 bg-destructive/5",
          submitted && "cursor-default",
        )}
      >
        <span
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs",
            flagged && !submitted && "border-destructive text-destructive",
            !flagged && !submitted && "border-border text-muted-foreground",
            submitted && correct && "border-primary text-primary",
            submitted && incorrect && "border-destructive text-destructive",
          )}
        >
          {submitted ? (
            correct ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )
          ) : flagged ? (
            <Flag className="h-3.5 w-3.5" />
          ) : (
            String(index + 1).padStart(2, "0")
          )}
        </span>

        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">
            {clause.text}
          </p>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex items-start gap-2 rounded-md border border-border/60 bg-background/60 p-3"
            >
              {clause.isRedFlag ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              ) : (
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              )}
              <div>
                <p
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest",
                    clause.isRedFlag ? "text-destructive" : "text-primary",
                  )}
                >
                  {clause.isRedFlag ? "Red flag" : "Legit clause"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {clause.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </button>
    </li>
  )
}
