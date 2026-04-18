import { Banknote, FileSignature, Stethoscope, RotateCcw } from "lucide-react"
import {
  getEventHistory,
  getOrCreateGameState,
  resetGame,
} from "@/lib/game-actions"
import { MODULE_META, type ModuleId } from "@/lib/game-types"
import { AvatarPlayer } from "@/components/game/avatar-player"
import { StatBar } from "@/components/game/stat-bar"
import { ModuleCard } from "@/components/game/module-card"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const state = await getOrCreateGameState()
  const events = await getEventHistory(8)

  const completed = new Set<ModuleId>(state.completedModules)
  const order: ModuleId[] = ["paycheck", "rental", "bureaucracy"]

  function statusOf(id: ModuleId): "locked" | "available" | "completed" {
    if (completed.has(id)) return "completed"
    // All modules available from the start — hackathon demo friendly.
    return "available"
  }

  const moduleIcons: Record<ModuleId, React.ReactNode> = {
    paycheck: <Banknote className="h-5 w-5" />,
    rental: <FileSignature className="h-5 w-5" />,
    bureaucracy: <Stethoscope className="h-5 w-5" />,
  }

  const moduleHrefs: Record<ModuleId, string> = {
    paycheck: "/play/paycheck",
    rental: "/play/rental",
    bureaucracy: "/play/bureaucracy",
  }

  return (
    <main className="min-h-screen">
      <div className="grid-bg absolute inset-0 opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary glow-primary" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Adulting Sandbox
            </span>
          </div>
          <form action={resetGame}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
              Reset life
            </Button>
          </form>
        </div>

        {/* Hero: Avatar + Stats */}
        <section className="mb-12 grid gap-8 rounded-3xl border border-border bg-card/60 p-6 md:p-10 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-2">
            <AvatarPlayer
              cash={state.cash}
              health={state.health}
              stress={state.stress}
              size="lg"
            />
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Day 01 — End of month
              </p>
              <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-balance tracking-tight">
                {completed.size === 3
                  ? "You survived. Now go do it for real."
                  : completed.size === 0
                    ? "Welcome to your first grown-up month."
                    : `${3 - completed.size} chapter${
                        3 - completed.size === 1 ? "" : "s"
                      } to go.`}
              </h1>
              <p className="mt-2 max-w-xl text-pretty text-muted-foreground leading-relaxed">
                Your decisions here don&apos;t cost real money. Every choice
                moves the bars below. Try the risky path — that&apos;s the
                whole point.
              </p>
            </div>

            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <StatBar kind="cash" value={state.cash} formatAsCash />
              <StatBar kind="health" value={state.health} />
              <StatBar kind="stress" value={state.stress} />
              <StatBar kind="knowledge" value={state.knowledge} />
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Chapters
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Pick your next disaster
              </h2>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              {completed.size} / 3 cleared
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {order.map((id) => (
              <ModuleCard
                key={id}
                href={moduleHrefs[id]}
                order={MODULE_META[id].order}
                title={MODULE_META[id].title}
                tagline={MODULE_META[id].tagline}
                status={statusOf(id)}
                icon={moduleIcons[id]}
              />
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <div className="mb-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Log
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Recent decisions
            </h2>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No moves yet. Pick a chapter above to start writing your
                story.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card/60">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-4 px-4 py-3 md:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {e.module === "meta"
                        ? "System"
                        : MODULE_META[e.module as ModuleId]?.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {e.title}
                    </p>
                    {e.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-mono tabular-nums">
                    {renderDelta("cash", e.cashDelta)}
                    {renderDelta("health", e.healthDelta)}
                    {renderDelta("stress", e.stressDelta)}
                    {renderDelta("knowledge", e.knowledgeDelta)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

function renderDelta(
  kind: "cash" | "health" | "stress" | "knowledge",
  value: number,
) {
  if (!value) return null
  const sign = value > 0 ? "+" : ""
  const colorClass =
    kind === "cash"
      ? "text-accent border-accent/30"
      : kind === "health"
        ? "text-primary border-primary/30"
        : kind === "stress"
          ? "text-destructive border-destructive/30"
          : "text-foreground border-foreground/20"
  const label =
    kind === "cash" ? "zł" : kind === "knowledge" ? "xp" : kind[0].toUpperCase()
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border bg-background/60 px-1.5 py-0.5 ${colorClass}`}
    >
      {sign}
      {value}
      <span className="text-[9px] opacity-60">{label}</span>
    </span>
  )
}
