"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Mood = "chill" | "stressed" | "broke" | "sick" | "hype"

function pickMood({
  cash,
  health,
  stress,
}: {
  cash: number
  health: number
  stress: number
}): Mood {
  if (health < 40) return "sick"
  if (stress > 70) return "stressed"
  if (cash < 300) return "broke"
  if (stress < 30 && cash > 2000 && health > 70) return "hype"
  return "chill"
}

const MOOD_COPY: Record<Mood, string> = {
  chill: "Feeling aight.",
  stressed: "Heart rate: elevated.",
  broke: "Checking account: pain.",
  sick: "Throat like sandpaper.",
  hype: "Actually thriving.",
}

const MOOD_COLOR: Record<Mood, string> = {
  chill: "oklch(0.88 0.22 130)",
  stressed: "oklch(0.65 0.25 25)",
  broke: "oklch(0.78 0.17 75)",
  sick: "oklch(0.7 0.15 200)",
  hype: "oklch(0.88 0.22 130)",
}

export function AvatarPlayer({
  cash,
  health,
  stress,
  size = "md",
  className,
}: {
  cash: number
  health: number
  stress: number
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const mood = pickMood({ cash, health, stress })
  const color = MOOD_COLOR[mood]

  const dim = size === "sm" ? 88 : size === "lg" ? 192 : 128

  // Eye expression by mood
  const eyeY = mood === "sick" ? 62 : mood === "stressed" ? 56 : 58
  const mouthPath =
    mood === "hype"
      ? "M 42 78 Q 60 92 78 78"
      : mood === "chill"
        ? "M 44 80 Q 60 86 76 80"
        : mood === "broke"
          ? "M 44 84 Q 60 78 76 84"
          : mood === "sick"
            ? "M 44 82 Q 60 74 76 82"
            : "M 44 84 L 76 84"

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <motion.div
        key={mood}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative"
        style={{ width: dim, height: dim }}
      >
        {/* Glow ring */}
        <motion.div
          animate={{
            boxShadow: [
              `0 0 0 0 ${color}00`,
              `0 0 28px 4px ${color}55`,
              `0 0 0 0 ${color}00`,
            ],
          }}
          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "transparent" }}
        />

        <svg
          viewBox="0 0 120 120"
          width={dim}
          height={dim}
          className="relative"
          aria-label={`Player avatar, mood: ${mood}`}
          role="img"
        >
          <defs>
            <radialGradient id="avatar-bg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background halo */}
          <circle cx="60" cy="60" r="58" fill="url(#avatar-bg)" />

          {/* Head */}
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="oklch(0.22 0.012 150)"
            stroke={color}
            strokeWidth="2.5"
          />

          {/* Hair / hoodie hint */}
          <path
            d="M 22 56 Q 60 14 98 56 L 96 50 Q 60 22 24 50 Z"
            fill={color}
            opacity="0.85"
          />

          {/* Eyes */}
          {mood === "sick" ? (
            <>
              <path
                d="M 40 58 L 52 58"
                stroke="oklch(0.97 0.005 110)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 68 58 L 80 58"
                stroke="oklch(0.97 0.005 110)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle cx="46" cy={eyeY} r="3.5" fill="oklch(0.97 0.005 110)" />
              <circle cx="74" cy={eyeY} r="3.5" fill="oklch(0.97 0.005 110)" />
            </>
          )}

          {/* Brow for stressed */}
          {mood === "stressed" && (
            <>
              <path
                d="M 40 50 L 52 53"
                stroke="oklch(0.97 0.005 110)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 80 50 L 68 53"
                stroke="oklch(0.97 0.005 110)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Mouth */}
          <path
            d={mouthPath}
            stroke="oklch(0.97 0.005 110)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sweat drop for stressed */}
          {mood === "stressed" && (
            <motion.circle
              animate={{ y: [0, 3, 0], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
              cx="86"
              cy="64"
              r="3"
              fill="oklch(0.7 0.15 200)"
            />
          )}
        </svg>
      </motion.div>

      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {mood}
        </p>
        <p className="text-sm text-pretty max-w-[16rem] text-foreground/80">
          {MOOD_COPY[mood]}
        </p>
      </div>
    </div>
  )
}
