import { GLOBAL_AI_INVESTMENT_2026 } from './capex';
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
 */
export const BASELINE = {
  totalCapexUsd: GLOBAL_AI_INVESTMENT_2026.value,
  activeUsers: GLOBAL_AI_USERS.value,
  paybackYears: 5,
  targetMargin: 0.3,
  /** Serving cost per active user per year, on top of repaying the build. */
  opexPerUserYearUsd: 12,
  paidConversionRate: PAID_CONVERSION_RATE.value,
} as const;

export const REFERENCE_PRICE = REFERENCE_PRICE_PER_MONTH.value;
