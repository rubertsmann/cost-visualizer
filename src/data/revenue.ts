import { SOURCES } from './sources';
import { BILLION, type DatedPoint, type Sourced } from './types';

/**
 * Annualized revenue run-rate, not booked annual revenue. Run-rate is what
 * both companies report, so it is what we plot — but it flatters a fast
 * grower, and the page says so where it matters.
 *
 * Series through 2025-12-31 is Epoch AI's compilation of public reports;
 * the 2026 points come from the individual reports cited below.
 */
export const OPENAI_ARR: readonly DatedPoint[] = [
  { date: '2023-08-29', usd: 1.0 * BILLION },
  { date: '2023-10-10', usd: 1.3 * BILLION },
  { date: '2023-12-31', usd: 2.0 * BILLION },
  { date: '2024-06-12', usd: 3.4 * BILLION },
  { date: '2024-09-12', usd: 4.0 * BILLION },
  { date: '2024-12-31', usd: 5.5 * BILLION },
  { date: '2025-06-09', usd: 10.0 * BILLION },
  { date: '2025-08-01', usd: 13.0 * BILLION },
  { date: '2025-12-31', usd: 20.0 * BILLION },
  { date: '2026-04-01', usd: 24.0 * BILLION },
  { date: '2026-08-01', usd: 40.0 * BILLION },
];

export const ANTHROPIC_ARR: readonly DatedPoint[] = [
  { date: '2024-12-31', usd: 1.0 * BILLION },
  { date: '2025-03-31', usd: 2.0 * BILLION },
  { date: '2025-05-30', usd: 3.0 * BILLION },
  { date: '2025-07-29', usd: 5.0 * BILLION },
  { date: '2025-10-21', usd: 7.0 * BILLION },
  { date: '2025-12-31', usd: 9.0 * BILLION },
  { date: '2026-02-12', usd: 14.0 * BILLION },
  { date: '2026-05-01', usd: 47.0 * BILLION },
  { date: '2026-07-31', usd: 65.0 * BILLION },
];

export const OPENAI_ARR_SOURCE: Sourced<readonly DatedPoint[]> = {
  value: OPENAI_ARR,
  asOf: '2026-08-01',
  source: SOURCES.epochRevenue,
  note: 'Through 2025-12-31 from Epoch AI; 2026 points from Sacra and ValueAdd VC.',
};

export const ANTHROPIC_ARR_SOURCE: Sourced<readonly DatedPoint[]> = {
  value: ANTHROPIC_ARR,
  asOf: '2026-08-17',
  source: SOURCES.epochRevenue,
  note: 'Through 2026-02-12 from Epoch AI; later points from TechCrunch. ~85% of Anthropic revenue is enterprise, not consumer subscriptions.',
};

/** Latest combined run-rate of the two largest pure-play labs. */
export const COMBINED_LAB_ARR_USD =
  (OPENAI_ARR.at(-1)?.usd ?? 0) + (ANTHROPIC_ARR.at(-1)?.usd ?? 0);
