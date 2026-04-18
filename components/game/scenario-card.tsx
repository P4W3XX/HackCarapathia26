"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Banknote, HeartPulse, Zap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Delta } from "@/lib/game-types"

export type Choice = {
  id: string
  label: string
  hint?: string
  delta: Delta
  outcome: string
  vibe?: "safe" | "risky" | "ugly"
}

export function ScenarioCard({
  chapter,
  title,
  narration,
  choices,
  onChoose,
  disabled,
  lastPicked,
}: {
  chapter: string
  title: string
  narration: React.ReactNode
  choices: Choice[]
  onChoose: (c: Choice) => void
  disabled?: boolean
  lastPicked?: string | null
}) {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -12, opacity: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="relative p-6 md:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
            {chapter}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-balance tracking-tight">
          {title}
        </h2>

        <div className="mt-4 text-base leading-relaxed text-foreground/85 text-pretty">
          {narration}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              disabled={disabled}
              onClick={() => onChoose(choice)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-xl border bg-background/60 p-4 text-left transition-all",
                "hover:border-primary hover:-translate-y-0.5 hover:bg-primary/5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                choice.vibe === "risky" && "border-accent/40",
                choice.vibe === "ugly" && "border-destructive/40",
                choice.vibe === "safe" && "border-primary/40",
                !choice.vibe && "border-border",
              )}
            >
              <div className="flex w-full items-start justify-between gap-3">
                <span className="font-medium text-foreground">
                  {choice.label}
                </span>
                <DeltaPreview delta={choice.delta} />
              </div>
              {choice.hint && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {choice.hint}
                </p>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {lastPicked && (
            <motion.div
              key={lastPicked}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-4"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">
                Outcome
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {lastPicked}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function DeltaPreview({ delta }: { delta: Delta }) {
  const items: { icon: typeof Banknote; value: number; color: string }[] = []
  if (delta.cash) {
    items.push({
      icon: Banknote,
      value: delta.cash,
      color: "text-accent",
    })
  }
  if (delta.health) {
    items.push({
      icon: HeartPulse,
      value: delta.health,
      color: "text-primary",
    })
  }
  if (delta.stress) {
    items.push({
      icon: Zap,
      value: delta.stress,
      color: "text-destructive",
    })
  }
  if (delta.knowledge) {
    items.push({
      icon: BookOpen,
      value: delta.knowledge,
      color: "text-foreground",
    })
  }

  if (items.length === 0) return null

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-xs font-mono tabular-nums">
      {items.map((it, idx) => {
        const I = it.icon
        const sign = it.value > 0 ? "+" : ""
        return (
          <span
            key={idx}
            className={cn(
              "inline-flex items-center gap-1 rounded border border-border/60 bg-background/60 px-1.5 py-0.5",
              it.color,
            )}
          >
            <I className="h-3 w-3" />
            {sign}
            {it.value}
          </span>
        )
      })}
    </div>
  )
}
