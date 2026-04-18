import type { Scene } from "@/lib/scenarios/paycheck"

export const BUREAUCRACY_SCENES: Scene[] = [
  {
    id: "wake-up",
    chapter: "07:14 — Monday",
    title: "You wake up feeling like death.",
    narration:
      "Fever, throat on fire, body aching. You have a sprint review at 10am. How you handle this morning literally determines how the next 7 days go.",
    choices: [
      {
        id: "push-through",
        label: "Shower, caffeine, log in anyway",
        hint: "Nobody knows you're dying.",
        delta: { health: -12, stress: 15, knowledge: 0, cash: 0 },
        outcome:
          "You made the standup. Your brain is soup. By 3pm your manager can hear you coughing on the call.",
        vibe: "risky",
      },
      {
        id: "ezla",
        label: "Call a doctor for an e-ZLA (sick leave)",
        hint: "Online consult ~80 zł. Legal, recognized by ZUS and your employer.",
        delta: { cash: -80, health: 15, stress: -10, knowledge: 20 },
        outcome:
          "Tele-consult booked. Doctor issues an e-ZLA — it auto-flies to your employer and ZUS. You sleep.",
        vibe: "safe",
      },
      {
        id: "ghost",
        label: "Just... don't show up. Text later.",
        hint: "No doctor's note. Unexplained absence.",
        delta: { health: 3, stress: 20, knowledge: -2, cash: -300 },
        outcome:
          "By 11am HR has emailed you. Unexcused absence hits your record — and potentially your paycheck.",
        vibe: "ugly",
      },
      {
        id: "pharmacy",
        label: "Drag yourself to a pharmacy, self-medicate",
        hint: "No sick leave, no real diagnosis.",
        delta: { cash: -60, health: -4, stress: 10, knowledge: 3 },
        outcome:
          "Paracetamol, spray, vitamins — 60 zł gone. You push through, but the illness stretches into week two.",
      },
    ],
  },
  {
    id: "day-3",
    chapter: "Day 3 — Still horizontal",
    title: "Your employer wants a status update.",
    narration:
      "Whatever you did Monday has consequences. Your manager is politely (?) asking when you'll be back. HR cc'd. How do you handle it?",
    choices: [
      {
        id: "pl-code",
        label: "Reply with your e-ZLA dates, link to internal policy",
        hint: "Under Polish labor law you're entitled to 80% pay during sick leave.",
        delta: { knowledge: 15, stress: -12, cash: 0, health: 4 },
        outcome:
          "Boss chills instantly. HR confirms: you're covered. Paid at 80% during leave, no discussion.",
        vibe: "safe",
      },
      {
        id: "vague-apology",
        label: "Send a vague 'sorry, feeling bad' text",
        hint: "No documentation, no boundary.",
        delta: { knowledge: 0, stress: 12, cash: -200, health: -2 },
        outcome:
          "Manager starts tracking this as 'performance concern'. Unpaid day logged silently.",
        vibe: "risky",
      },
      {
        id: "work-from-bed",
        label: "Offer to 'still take meetings from bed'",
        hint: "Martyrdom mode: activated.",
        delta: { stress: 8, health: -6, knowledge: -3 },
        outcome:
          "They accept. Now you're sick AND working. Recovery doubles. Boss remembers you as 'reliable' though.",
      },
    ],
  },
  {
    id: "nfz",
    chapter: "Day 5 — Specialist referral",
    title: "GP wants you to see a pulmonologist.",
    narration:
      "NFZ (public) wait time: 4 months. Private visit: 250 zł, next week. Your chest is not thrilled.",
    choices: [
      {
        id: "nfz-wait",
        label: "Go public (NFZ). Wait 4 months.",
        hint: "Free. But you'll feel it.",
        delta: { cash: 0, stress: 15, health: -5, knowledge: 10 },
        outcome:
          "Referral locked in. You'll re-evaluate in June. Your NFZ card earns its keep.",
      },
      {
        id: "private",
        label: "Pay 250 zł, see a specialist next week",
        hint: "Fast, but not free.",
        delta: { cash: -250, stress: -8, health: 8, knowledge: 10 },
        outcome:
          "Specialist rules out anything scary, hands you a real treatment plan. Money well spent.",
        vibe: "safe",
      },
      {
        id: "ignore",
        label: "Ignore it, hope it resolves",
        hint: "The 'walk it off' strategy.",
        delta: { cash: 0, stress: 5, health: -15, knowledge: -5 },
        outcome:
          "Two months later you're worse. Now it's an ER visit. Cheap became expensive.",
        vibe: "ugly",
      },
    ],
  },
  {
    id: "recap",
    chapter: "Day 10 — Back on your feet",
    title: "What did this sick week actually teach you?",
    narration:
      "Illness is a tax on not knowing the system. Lock in the lesson that'll save you the most next time.",
    choices: [
      {
        id: "ezla-lesson",
        label: "e-ZLA > ghosting. Always.",
        hint: "It's automatic, digital, legally binding.",
        delta: { knowledge: 15, stress: -8 },
        outcome:
          "You now know: tele-consult + e-ZLA = paid recovery. No HR drama.",
        vibe: "safe",
      },
      {
        id: "rights-lesson",
        label: "Know your 80% sick pay right",
        hint: "Polish Labor Code art. 92.",
        delta: { knowledge: 15, stress: -8 },
        outcome:
          "Sick pay is a legal entitlement, not a favor. You'll cite it calmly next time.",
        vibe: "safe",
      },
      {
        id: "hybrid-lesson",
        label: "NFZ for baseline, private for speed",
        hint: "Use both systems strategically.",
        delta: { knowledge: 15, stress: -6 },
        outcome:
          "Build the habit: routine stuff via NFZ, urgent specialists privately. Pragmatism > purity.",
        vibe: "safe",
      },
    ],
  },
]
