export type LeaseClause = {
  id: string
  text: string
  isRedFlag: boolean
  explanation: string
}

// Realistic Polish rental contract clauses (translated for English UI).
// Mix of legit and shady — player marks which ones are red flags.
export const LEASE_CLAUSES: LeaseClause[] = [
  {
    id: "c1",
    text:
      "Monthly rent is 2,400 zł, payable by the 10th of each month to the landlord's bank account.",
    isRedFlag: false,
    explanation:
      "Standard clause. Always pay via bank transfer — never cash — so you have proof.",
  },
  {
    id: "c2",
    text:
      "The landlord may enter the apartment at any time without prior notice to inspect the property.",
    isRedFlag: true,
    explanation:
      "Major red flag. Polish law requires the landlord to give reasonable advance notice. Your privacy is legally protected.",
  },
  {
    id: "c3",
    text:
      "The security deposit is 4,800 zł (2x monthly rent), refundable within 30 days of lease end.",
    isRedFlag: false,
    explanation:
      "Normal. Deposits up to 12x monthly rent are legal. 30-day refund window is standard.",
  },
  {
    id: "c4",
    text:
      "The tenant waives all rights to complain about noise, temperature, or minor defects for the duration of the lease.",
    isRedFlag: true,
    explanation:
      "Unenforceable. You cannot waive your right to a habitable apartment. This clause is void under consumer protection law.",
  },
  {
    id: "c5",
    text:
      "Utilities (electricity, gas, water, internet) are billed separately and paid directly by the tenant.",
    isRedFlag: false,
    explanation:
      "Common and fine — just confirm which utilities are included vs separate before signing.",
  },
  {
    id: "c6",
    text:
      "In case of any damage, the full security deposit will be forfeited automatically without inspection.",
    isRedFlag: true,
    explanation:
      "Illegal. Landlords must itemize damages and deduct actual costs. 'Automatic forfeiture' clauses don't hold up.",
  },
  {
    id: "c7",
    text:
      "The lease may be terminated by either party with 3 months written notice.",
    isRedFlag: false,
    explanation:
      "Reasonable notice period. Watch out for contracts that only let the LANDLORD exit on short notice.",
  },
  {
    id: "c8",
    text:
      "The tenant agrees to pay a 500 zł 'administrative fee' at the start of each quarter on top of rent.",
    isRedFlag: true,
    explanation:
      "Classic hidden fee. Any recurring charge must be clearly defined and justified. This is usually just padding rent.",
  },
]

export const REDFLAG_OUTCOMES = {
  perfect: {
    title: "Landlord just got caught.",
    body: "You spotted every red flag. This contract would have bled you dry — now you either negotiate them out or walk. Deposit intact, dignity intact.",
    delta: { knowledge: 30, stress: -10, health: 2 },
  },
  good: {
    title: "Close. Close but not quite.",
    body: "You caught most of the traps. The one you missed could still cost you, but you're sharp enough to ask questions before signing.",
    delta: { knowledge: 20, stress: -4 },
  },
  rough: {
    title: "You signed. You shouldn't have.",
    body: "Multiple shady clauses slipped through. In real life this means: surprise 'fees', deposit disputes, and a landlord who knows you won't push back.",
    delta: { cash: -800, stress: 18, knowledge: 12 },
  },
}
