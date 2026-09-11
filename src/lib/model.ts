/**
 * The break-even thought experiment.
 *
 * Not a forecast. It answers one narrow question: if the capital being
 * poured into AI had to come back out of users' pockets over some period,
 * what would each user's share be? Every input is contestable, which is
 * why Chapter 3 hands them all to the reader.
 */

export interface Assumptions {
  /** Total capital to be repaid, in US dollars. */
  totalCapexUsd: number;
  /** People to spread it across. */
  activeUsers: number;
  /** Years allowed to earn it back. */
  paybackYears: number;
  /** Operating margin the business wants on top of covering cost, 0..1. */
  targetMargin: number;
  /** Serving/inference cost per active user per year. */
  opexPerUserYearUsd: number;
  /** Share of active users who pay anything, 0..1. */
  paidConversionRate: number;
}

export interface BreakEven {
  /** Revenue needed per active user, per year / month / day. */
  perUserPerYear: number;
  perUserPerMonth: number;
  perUserPerDay: number;
  /** The same bill, concentrated onto only the users who actually pay. */
  perPayingUserPerMonth: number;
  perPayingUserPerYear: number;
  /** The sticker price being compared against. */
  currentPricePerMonth: number;
  /** Needed ÷ paid. Above 1 means today's price does not cover it. */
  multipleOfCurrentPrice: number;
  /** True when today's price already covers the bill. */
  isCovered: boolean;
  /** Aggregate annual gap across all active users. Zero when covered. */
  annualShortfallUsd: number;
}

const DAYS_PER_YEAR = 365.25;
const MONTHS_PER_YEAR = 12;

/** Highest margin we will model. At 1.0 the gross-up is infinite. */
const MAX_MARGIN = 0.95;

export function computeBreakEven(
  a: Assumptions,
  currentPricePerMonth: number,
): BreakEven {
  const capex = Math.max(0, a.totalCapexUsd);
  const users = Math.max(0, a.activeUsers);
  // A zero payback period means "earn it back immediately" — model that as
  // one year rather than returning Infinity.
  const years = a.paybackYears > 0 ? a.paybackYears : 1;
  const margin = clamp(a.targetMargin, 0, MAX_MARGIN);
  const opex = Math.max(0, a.opexPerUserYearUsd);

  const capexPerUserPerYear = users > 0 ? capex / users / years : 0;
  const costPerUserPerYear = capexPerUserPerYear + (users > 0 ? opex : 0);

  // Revenue must exceed cost by enough to leave `margin` of itself as profit.
  const perUserPerYear = costPerUserPerYear / (1 - margin);

  const conversion = clamp(a.paidConversionRate, 0, 1);
  const perPayingUserPerYear =
    conversion > 0 ? perUserPerYear / conversion : perUserPerYear;

  const paidPerYear = Math.max(0, currentPricePerMonth) * MONTHS_PER_YEAR;
  const multipleOfCurrentPrice = paidPerYear > 0 ? perUserPerYear / paidPerYear : 0;
  const isCovered = perUserPerYear <= paidPerYear;

  return {
    perUserPerYear,
    perUserPerMonth: perUserPerYear / MONTHS_PER_YEAR,
    perUserPerDay: perUserPerYear / DAYS_PER_YEAR,
    perPayingUserPerYear,
    perPayingUserPerMonth: perPayingUserPerYear / MONTHS_PER_YEAR,
    currentPricePerMonth,
    multipleOfCurrentPrice,
    isCovered,
    annualShortfallUsd: isCovered ? 0 : (perUserPerYear - paidPerYear) * users,
  };
}

export function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

const WHOLE = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(n: number, opts?: { cents?: boolean }): string {
  if (!Number.isFinite(n)) return '—';
  return opts?.cents ? CENTS.format(n) : WHOLE.format(n);
}

const MAGNITUDES = [
  { limit: 1e12, suffix: 'T', digits: 1 },
  { limit: 1e9, suffix: 'B', digits: 1 },
  { limit: 1e6, suffix: 'M', digits: 0 },
] as const;

/**
 * Compact currency for axes and headline counters. Keeps one decimal at
 * trillions and billions so $1.0T and $1.5B stay distinguishable, but drops
 * it once the leading digits already carry the magnitude ($770B, $250M).
 */
export function formatCompactUsd(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  for (const { limit, suffix, digits } of MAGNITUDES) {
    if (abs >= limit) {
      const scaled = abs / limit;
      // $770B reads better than $770.0B; $1.5B needs the decimal.
      const places = scaled >= 100 ? 0 : digits;
      return `${sign}$${scaled.toFixed(places)}${suffix}`;
    }
  }
  return `${sign}${WHOLE.format(abs)}`;
}

/** "4.3×" — the headline multiple in Chapter 2. */
export function formatMultiple(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n >= 10 ? Math.round(n) : n.toFixed(1)}×`;
}
