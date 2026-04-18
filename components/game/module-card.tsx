import Link from "next/link"
import { ArrowRight, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModuleCard({
  href,
  order,
  title,
  tagline,
  status,
  icon,
}: {
  href: string
  order: number
  title: string
  tagline: string
  status: "locked" | "available" | "in-progress" | "completed"
  icon: React.ReactNode
}) {
  const locked = status === "locked"
  const completed = status === "completed"
  const inProgress = status === "in-progress"

  const body = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 transition-all",
        locked
          ? "border-border/60 opacity-60"
          : "border-border hover:border-primary hover:-translate-y-0.5",
      )}
    >
      {inProgress && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          In progress
        </span>
      )}
      {completed && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
          <Check className="h-3 w-3" />
          Cleared
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl border text-primary",
            locked
              ? "border-border bg-background"
              : "border-primary/40 bg-primary/10",
          )}
        >
          {locked ? <Lock className="h-5 w-5 text-muted-foreground" /> : icon}
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Chapter {String(order).padStart(2, "0")}
          </p>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {tagline}
      </p>

      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          locked ? "text-muted-foreground" : "text-primary",
        )}
      >
        {locked
          ? "Clear previous chapter first"
          : completed
            ? "Replay"
            : inProgress
              ? "Resume"
              : "Start chapter"}
        {!locked && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </div>
    </div>
  )

  if (locked) return body
  return <Link href={href}>{body}</Link>
}
