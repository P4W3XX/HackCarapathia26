import type { Choice } from "@/components/game/scenario-card"

export type Scene = {
  id: string
  chapter: string
  title: string
  narration: string
  choices: Choice[]
}

export const PAYCHECK_SCENES: Scene[] = [
  {
    id: "budget",
    chapter: "Day 01 — Paycheck day",
    title: "3,200 zł just landed. Allocate it.",
    narration:
      "Rent is due in 5 days (1,800 zł). Groceries need to happen. Your internal monologue is screaming 'treat yourself'. How do you split what's left?",
    choices: [
      {
        id: "strict",
        label: "The Spreadsheet Move",
        hint: "Rent 1,800 · Food 500 · Savings 600 · Fun 300",
        delta: { cash: 0, stress: 5, knowledge: 10, health: 2 },
        outcome:
          "You log every expense in Notion. Future-you sheds a single, grateful tear. Savings buffer locked.",
        vibe: "safe",
      },
      {
        id: "balanced",
        label: "Vibe Budget",
        hint: "Rent 1,800 · Food 400 · Fun 600 · Savings 400",
        delta: { cash: 0, stress: 0, knowledge: 5, health: 0 },
        outcome:
          "A reasonable split. You sleep fine, eat fine, party fine. Normcore adulting.",
      },
      {
        id: "yolo",
        label: "'I'll figure it out later'",
        hint: "Rent 1,800 · Food 200 · Fun 1,100 · Savings 100",
        delta: { cash: 0, stress: 12, knowledge: 0, health: -4 },
        outcome:
          "The vibes are immaculate. The kitchen is empty. Instant noodles become a personality trait.",
        vibe: "risky",
      },
      {
        id: "no-rent",
        label: "Rent? Next month maybe",
        hint: "Landlord: not a chill guy.",
        delta: { cash: -200, stress: 25, knowledge: -5, health: -3 },
        outcome:
          "Late fee lands. Landlord texts in ALL CAPS. Your stress score noticed.",
        vibe: "ugly",
      },
    ],
  },
  {
    id: "laptop",
    chapter: "Day 12 — Side hustle emergency",
    title: "Your laptop just died mid-deadline.",
    narration:
      "Replacement: ~1,500 zł minimum. You have a freelance invoice due in 3 days. Your move decides whether your side income survives the month.",
    choices: [
      {
        id: "savings",
        label: "Tap the savings",
        hint: "Painful, but interest-free.",
        delta: { cash: -1500, stress: 10, knowledge: 8, health: 0 },
        outcome:
          "The emergency fund exists for exactly this. You feel adult. Slightly poorer, fully operational.",
        vibe: "safe",
      },
      {
        id: "refurb",
        label: "Buy a refurbished one",
        hint: "800 zł, but it's held together by prayer.",
        delta: { cash: -800, stress: 6, knowledge: 5, health: -1 },
        outcome:
          "It boots. The battery lasts 40 minutes. Good enough to ship the project.",
      },
      {
        id: "chwilowka",
        label: "Take a 'chwilówka' (payday loan)",
        hint: "APR north of 300%. They call you 'preferred customer'.",
        delta: { cash: -1800, stress: 25, knowledge: 15, health: -5 },
        outcome:
          "1,500 now, 1,800 back in 30 days. Lesson acquired the painful way: payday loans are a trap.",
        vibe: "ugly",
      },
      {
        id: "borrow-friend",
        label: "Ask a friend to lend you cash",
        hint: "Free money. Cost: the vibe.",
        delta: { cash: -1500, stress: 8, knowledge: 4, health: -1 },
        outcome:
          "They said yes. Your friendship has a new silent clause. Pay it back fast.",
      },
    ],
  },
  {
    id: "concert",
    chapter: "Day 22 — Temptation hits",
    title: "Festival ticket, last minute: 450 zł.",
    narration:
      "Your group chat is exploding. Everyone's going. You have 3 days until next paycheck. Your savings just survived the laptop thing.",
    choices: [
      {
        id: "go",
        label: "Send it. You only live once.",
        hint: "450 zł gone + 200 zł on-site.",
        delta: { cash: -650, stress: -10, knowledge: 2, health: 2 },
        outcome:
          "Unreal night. Zero regrets. Budget: in cardiac arrest. Ramen week incoming.",
        vibe: "risky",
      },
      {
        id: "pregame",
        label: "Skip ticket, host pre-party at home",
        hint: "Make plans, not purchases.",
        delta: { cash: -80, stress: -5, knowledge: 6, health: 1 },
        outcome:
          "Friends show up with snacks. Cheaper, equally memorable. FOMO neutralized.",
        vibe: "safe",
      },
      {
        id: "decline",
        label: "Politely tap out",
        hint: "Your wallet thanks you.",
        delta: { cash: 0, stress: 8, knowledge: 5, health: 0 },
        outcome:
          "You watch the Instagram stories alone. Mature, boring, solvent.",
      },
    ],
  },
  {
    id: "recap",
    chapter: "Day 30 — Rent day again",
    title: "End-of-month reality check.",
    narration:
      "Your bank app tells no lies. Did you clear rent? Did you save anything? Every decision above is now a number. Pick what you learned — it sticks.",
    choices: [
      {
        id: "lesson-budget",
        label: "Lesson: budget THEN spend, not reverse",
        hint: "Envelope method engaged.",
        delta: { knowledge: 15, stress: -10 },
        outcome:
          "Classic 50/30/20 imprinted. Next month's paycheck already has a plan.",
        vibe: "safe",
      },
      {
        id: "lesson-emergency",
        label: "Lesson: build a 3-month emergency fund",
        hint: "Future laptop deaths inbound.",
        delta: { knowledge: 15, stress: -8 },
        outcome:
          "Goal set: stash roughly 3 months of rent. Compound peace of mind.",
        vibe: "safe",
      },
      {
        id: "lesson-loans",
        label: "Lesson: chwilówki are financial quicksand",
        hint: "RRSO > 300% is not 'a quick fix'.",
        delta: { knowledge: 15, stress: -6 },
        outcome:
          "Flagged forever. You now know what RRSO means and check it instinctively.",
        vibe: "safe",
      },
    ],
  },
]
