"use client"

import { motion } from "framer-motion"
import { Banknote, HeartPulse, Zap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

type StatKind = "cash" | "health" | "stress" | "knowledge"

const META: Record<
  StatKind,
  {
    label: string
    icon: typeof Banknote
    color: string
    trackClass: string
    barClass: string
  }
> = {
  cash: {
    label: "Cash",
    icon: Banknote,
    color: "oklch(0.78 0.17 75)",
    trackClass: "bg-accent/15",
    barClass: "bg-accent",
  },
  health: {
    label: "Health",
    icon: HeartPulse,
    color: "oklch(0.88 0.22 130)",
    trackClass: "bg-primary/15",
    barClass: "bg-primary",
  },
  stress: {
    label: "Stress",
    icon: Zap,
    color: "oklch(0.65 0.25 25)",
    trackClass: "bg-destructive/15",
    barClass: "bg-destructive",
  },
  knowledge: {
    label: "Knowledge",
    icon: BookOpen,
    color: "oklch(0.97 0.005 110)",
    trackClass: "bg-foreground/10",
    barClass: "bg-foreground",
  },
}

export function StatBar({
  kind,
  value,
  max = 100,
  showNumber = true,
  formatAsCash = false,
  className,
}: {
  kind: StatKind
  value: number
  max?: number
  showNumber?: boolean
  formatAsCash?: boolean
  className?: string
}) {
  const meta = META[kind]
  const Icon = meta.icon
  const pct =
    formatAsCash
      ? Math.max(0, Math.min(100, (value / 5000) * 100))
      : Math.max(0, Math.min(100, (value / max) * 100))

  const displayValue = formatAsCash
    ? `${value.toLocaleString("en-US")} zł`
    : `${value}`

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
          {meta.label}
        </span>
        {showNumber && (
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-foreground tabular-nums"
          >
            {displayValue}
          </motion.span>
        )}
      </div>
      <div
        className={cn("h-2 rounded-full overflow-hidden", meta.trackClass)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={formatAsCash ? 5000 : max}
        aria-label={meta.label}
      >
        <motion.div
          className={cn("h-full rounded-full", meta.barClass)}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />
      </div>
    </div>
  )
}
