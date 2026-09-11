import { CUMULATIVE_CAPEX_USD } from './capex';
import { REFERENCE_PRICE_PER_MONTH } from './pricing';
import { GLOBAL_AI_USERS, PAID_CONVERSION_RATE } from './users';

export * from './types';
export * from './sources';
export * from './capex';
export * from './revenue';
export * from './users';
export * from './pricing';

/**
 * The researched starting position for Chapter 3's sliders. Every value
 * traces to a cited figure; "reset" returns here.
 *
 * The capital figure is CUMULATIVE Big Five capex 2022-2026, not a single
 * year. Spreading one year's spend over a five-year payback would quietly
 * flatter the answer: the build is ongoing, and all of it has to come back.
 */
export const BASELINE = {
  totalCapexUsd: CUMULATIVE_CAPEX_USD,
  activeUsers: GLOBAL_AI_USERS.value,
  paybackYears: 5,
  targetMargin: 0.3,
  /** Serving cost per active user per year, on top of repaying the build. */
  opexPerUserYearUsd: 12,
  paidConversionRate: PAID_CONVERSION_RATE.value,
} as const;

export const REFERENCE_PRICE = REFERENCE_PRICE_PER_MONTH.value;
