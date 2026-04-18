import Link from "next/link"
import { ArrowRight, Banknote, FileSignature, Stethoscope } from "lucide-react"
import { startNewGame } from "@/lib/game-actions"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.22 130 / 0.35) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary glow-primary" />
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
              Adulting Sandbox
            </span>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground md:inline">
            v0.1 — hackathon build
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            Learn life. Lose safely.
          </span>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-7xl">
            Your first paycheck is <span className="text-primary">here.</span>
            <br />
            <span className="text-muted-foreground">
              Try not to wreck it.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80 text-pretty">
            Adulting Sandbox is a choose-your-own-disaster life sim. Make real
            decisions about rent, contracts, and sick leave — and watch your
            Cash, Health, and Stress react. School never taught you this.
            We will.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <form action={startNewGame}>
              <Button
                type="submit"
                size="lg"
                className="group h-12 gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Start new life
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-border bg-background/50 text-base"
            >
              <Link href="/dashboard">Continue existing save</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 border-t border-border/60 pt-10 md:grid-cols-3">
          <ModulePreview
            icon={<Banknote className="h-5 w-5" />}
            tag="Chapter 01"
            title="First Paycheck"
            blurb="Budget 3,200 zł. Then the laptop dies. Then your friend wants Ibiza. GG."
          />
          <ModulePreview
            icon={<FileSignature className="h-5 w-5" />}
            tag="Chapter 02"
            title="Rental Red Flags"
            blurb="Scan a real lease for scam clauses. Miss one — kiss your deposit goodbye."
          />
          <ModulePreview
            icon={<Stethoscope className="h-5 w-5" />}
            tag="Chapter 03"
            title="Sick Day Sim"
            blurb="Sniffles at 7am. e-ZLA, NFZ, or grind? Each path bills differently."
          />
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <span>Built for Gen-Z. Powered by regret.</span>
          <span>No real money harmed</span>
        </footer>
      </div>
    </main>
  )
}

function ModulePreview({
  icon,
  tag,
  title,
  blurb,
}: {
  icon: React.ReactNode
  tag: string
  title: string
  blurb: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/60">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-primary">
          {icon}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {tag}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
        {blurb}
      </p>
    </div>
  )
}
