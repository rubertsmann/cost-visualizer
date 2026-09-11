import { describe, expect, it } from 'vitest';
import {
  computeBreakEven,
  formatCompactUsd,
  formatUsd,
  type Assumptions,
} from './model';

const base: Assumptions = {
  totalCapexUsd: 1e12,
  activeUsers: 1e9,
  paybackYears: 5,
  targetMargin: 0,
  opexPerUserYearUsd: 0,
  paidConversionRate: 1,
};

describe('computeBreakEven', () => {
  it('spreads capital across users and years', () => {
    // $1T / 1B users / 5 years = $200 per user per year.
    const r = computeBreakEven(base, 20);
    expect(r.perUserPerYear).toBeCloseTo(200, 6);
    expect(r.perUserPerMonth).toBeCloseTo(200 / 12, 6);
    expect(r.perUserPerDay).toBeCloseTo(200 / 365.25, 6);
  });

  it('adds serving cost on top of repaying the build', () => {
    const r = computeBreakEven({ ...base, opexPerUserYearUsd: 50 }, 20);
    expect(r.perUserPerYear).toBeCloseTo(250, 6);
  });

  it('grosses up for a target margin', () => {
    // $200 of cost at a 50% margin needs $400 of revenue.
    const r = computeBreakEven({ ...base, targetMargin: 0.5 }, 20);
    expect(r.perUserPerYear).toBeCloseTo(400, 6);
  });

  it('concentrates the bill on the people who actually pay', () => {
    const r = computeBreakEven({ ...base, paidConversionRate: 0.05 }, 20);
    // Same $200 per active user, but only 1 in 20 is paying it.
    expect(r.perUserPerYear).toBeCloseTo(200, 6);
    expect(r.perPayingUserPerMonth).toBeCloseTo(200 / 0.05 / 12, 6);
  });

  it('compares against what people pay today', () => {
    const r = computeBreakEven(base, 20);
    expect(r.currentPricePerMonth).toBe(20);
    // $200/yr needed vs $240/yr paid — this one is actually covered.
    expect(r.multipleOfCurrentPrice).toBeCloseTo(200 / 240, 6);
    expect(r.isCovered).toBe(true);
    expect(r.annualShortfallUsd).toBe(0);
  });

  it('reports the shortfall when the price does not cover the cost', () => {
    // $1T over 1 year across 1B users = $1000/user/yr vs $240 paid.
    const r = computeBreakEven({ ...base, paybackYears: 1 }, 20);
    expect(r.perUserPerYear).toBeCloseTo(1000, 6);
    expect(r.isCovered).toBe(false);
    expect(r.annualShortfallUsd).toBeCloseTo((1000 - 240) * 1e9, 0);
  });
});

describe('computeBreakEven guards', () => {
  it('returns zeroes rather than Infinity when there are no users', () => {
    const r = computeBreakEven({ ...base, activeUsers: 0 }, 20);
    expect(Number.isFinite(r.perUserPerYear)).toBe(true);
    expect(r.perUserPerYear).toBe(0);
    expect(r.perPayingUserPerMonth).toBe(0);
  });

  it('treats a zero payback period as one year rather than dividing by zero', () => {
    const r = computeBreakEven({ ...base, paybackYears: 0 }, 20);
    expect(Number.isFinite(r.perUserPerYear)).toBe(true);
    expect(r.perUserPerYear).toBeCloseTo(1000, 6);
  });

  it('never divides by zero on conversion rate', () => {
    const r = computeBreakEven({ ...base, paidConversionRate: 0 }, 20);
    expect(Number.isFinite(r.perPayingUserPerMonth)).toBe(true);
  });

  it('clamps a margin of 1 or more instead of producing Infinity', () => {
    const r = computeBreakEven({ ...base, targetMargin: 1 }, 20);
    expect(Number.isFinite(r.perUserPerYear)).toBe(true);
    expect(r.perUserPerYear).toBeGreaterThan(200);
  });

  it('never returns a negative bill', () => {
    const r = computeBreakEven({ ...base, totalCapexUsd: -1e12 }, 20);
    expect(r.perUserPerYear).toBeGreaterThanOrEqual(0);
  });
});

describe('formatters', () => {
  it('formats whole dollars without noise', () => {
    expect(formatUsd(1043)).toBe('$1,043');
    expect(formatUsd(0)).toBe('$0');
  });

  it('keeps cents only where they carry meaning', () => {
    expect(formatUsd(2.85, { cents: true })).toBe('$2.85');
    expect(formatUsd(0.01, { cents: true })).toBe('$0.01');
  });

  it('compacts large magnitudes', () => {
    expect(formatCompactUsd(1e12)).toBe('$1.0T');
    expect(formatCompactUsd(770e9)).toBe('$770B');
    expect(formatCompactUsd(1.5e9)).toBe('$1.5B');
    expect(formatCompactUsd(250e6)).toBe('$250M');
    expect(formatCompactUsd(999)).toBe('$999');
  });

  it('compacts negatives symmetrically', () => {
    expect(formatCompactUsd(-1e12)).toBe('-$1.0T');
  });
});
