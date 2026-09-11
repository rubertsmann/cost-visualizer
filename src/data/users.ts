import { SOURCES } from './sources';
import { type Sourced } from './types';

const MILLION = 1e6;

/**
 * The denominator. Which number you divide by changes the answer more than
 * anything else on this page, which is exactly why Chapter 3 lets the
 * reader move it.
 */
export const CHATGPT_WEEKLY_ACTIVE: Sourced<number> = {
  value: 900 * MILLION,
  asOf: '2026-06-01',
  source: SOURCES.sacraOpenAI,
  note: 'ChatGPT passed 1B monthly actives in June 2026; ~900M weekly.',
};

export const CHATGPT_PAID_SUBSCRIBERS: Sourced<number> = {
  value: 50 * MILLION,
  asOf: '2026-08-01',
  source: SOURCES.valueAddOpenAI,
  note: 'Over 50M paid consumer subscribers, plus 7M+ enterprise seats.',
};

/**
 * Rough global count of people using any major assistant at least weekly.
 * Deliberately conservative: it is a headcount of humans, and the same
 * person using two assistants is one person paying one bill.
 */
export const GLOBAL_AI_USERS: Sourced<number> = {
  value: 1200 * MILLION,
  asOf: '2026-08-01',
  source: SOURCES.sacraOpenAI,
  note: 'Derived: ChatGPT ~900M weekly plus an allowance for Gemini, Claude, Copilot and Meta AI users who do not also use ChatGPT.',
};

/** Share of active users who pay anything at all. */
export const PAID_CONVERSION_RATE: Sourced<number> = {
  value: 50 / 900,
  asOf: '2026-08-01',
  source: SOURCES.valueAddOpenAI,
  note: 'Derived: ~50M paying against ~900M weekly actives — about 5.6%.',
};
