"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import type { GameState } from "@/lib/game-types"
import { StatBar } from "@/components/game/stat-bar"

export function Hud({
  state,
  title,
  backHref = "/dashboard",
}: {
  state: GameState
  title?: string
  backHref?: string
}) {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary glow-primary" />
            Adulting Sandbox
          </Link>
          {title && (
            <>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-sm font-medium text-foreground">
                {title}
              </span>
            </>
          )}
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4 md:max-w-2xl">
          <StatBar kind="cash" value={state.cash} formatAsCash />
          <StatBar kind="health" value={state.health} />
          <StatBar kind="stress" value={state.stress} />
          <StatBar kind="knowledge" value={state.knowledge} />
        </div>
      </div>
    </motion.header>
  )
}
