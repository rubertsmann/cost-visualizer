import { SOURCES } from './sources';
import { BILLION, TRILLION, type Sourced, type YearPoint } from './types';

/**
 * Combined annual capital expenditure of the "Big Five" —
 * Alphabet, Amazon, Meta, Microsoft, Oracle.
 *
 * 2022 and 2023 are sums of Epoch AI's reported quarterly totals.
 * 2024 is derived (see note). 2025 is reported actual. 2026 is company
 * guidance aggregated by Epoch AI.
 *
 * This is TOTAL capex, not AI-only: these firms build general cloud
 * capacity too. Analysts put the AI share of recent years around 75%,
 * which the model exposes as an adjustable assumption rather than
 * baking in silently.
 */
export const BIG_FIVE_CAPEX: readonly YearPoint[] = [
  { year: 2022, usd: 162.3 * BILLION, certainty: 'actual' },
  { year: 2023, usd: 161.3 * BILLION, certainty: 'actual' },
  { year: 2024, usd: 265 * BILLION, certainty: 'derived' },
  { year: 2025, usd: 448.3 * BILLION, certainty: 'actual' },
  { year: 2026, usd: 770 * BILLION, certainty: 'guidance' },
];

export const CAPEX_NOTES: Readonly<Record<number, string>> = {
  2022: "Sum of Epoch AI's reported quarterly totals for the Big Five.",
  2023: "Sum of Epoch AI's reported quarterly totals for the Big Five.",
  2024: 'Derived: ~$251B reported for the Big Four plus an estimated ~$14B for Oracle.',
  2025: 'Reported actual, Big Five combined.',
  2026: 'Company guidance aggregated by Epoch AI. Individual firms have revised upward mid-year.',
};

export const BIG_FIVE_CAPEX_SOURCE: Sourced<readonly YearPoint[]> = {
  value: BIG_FIVE_CAPEX,
  asOf: '2026-02-26',
  source: SOURCES.epochCapex,
  note: 'Alphabet, Amazon, Meta, Microsoft, Oracle. Total capex, not AI-only.',
};

/** 2026 capex guidance per company. Ranges are shown as their midpoint. */
export interface PlayerCapex {
  readonly name: string;
  readonly usd2026: number;
  readonly usd2025: number;
  /** Set when the company guided a range rather than a point. */
  readonly range2026?: readonly [number, number];
}

export const PLAYERS_2026: readonly PlayerCapex[] = [
  { name: 'Amazon', usd2026: 200 * BILLION, usd2025: 125 * BILLION },
  {
    name: 'Alphabet',
    usd2026: 180 * BILLION,
    usd2025: 91 * BILLION,
    range2026: [175 * BILLION, 185 * BILLION],
  },
  {
    name: 'Meta',
    usd2026: 125 * BILLION,
    usd2025: 72 * BILLION,
    range2026: [115 * BILLION, 135 * BILLION],
  },
  {
    name: 'Microsoft',
    usd2026: 120 * BILLION,
    usd2025: 90 * BILLION,
    range2026: [110 * BILLION, 190 * BILLION],
  },
  { name: 'Oracle', usd2026: 50 * BILLION, usd2025: 21 * BILLION },
];

export const PLAYERS_SOURCE: Sourced<readonly PlayerCapex[]> = {
  value: PLAYERS_2026,
  asOf: '2026-09-01',
  source: SOURCES.dcRichness,
  note: "Microsoft's 2026 range is unusually wide across sources ($110B–$190B); the midpoint is not used, the low end is, to stay conservative.",
};

/**
 * Goldman Sachs' estimate of GLOBAL AI investment in 2026 — wider than
 * the Big Five, including other clouds, sovereign programmes and startups.
 * This is the headline number Chapter 2 spreads across the user base.
 */
export const GLOBAL_AI_INVESTMENT_2026: Sourced<number> = {
  value: 1 * TRILLION,
  asOf: '2026-01-01',
  source: SOURCES.goldmanTrillion,
  note: 'Global, all AI-related investment in calendar 2026, including ~$581B in the US.',
};

/** Cumulative Big Five capex across the years we have data for. */
export const CUMULATIVE_CAPEX_USD = BIG_FIVE_CAPEX.reduce((sum, p) => sum + p.usd, 0);
