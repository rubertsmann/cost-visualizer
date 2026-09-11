import { SOURCES } from './sources';
import { type Sourced } from './types';

export interface Tier {
  readonly vendor: string;
  readonly name: string;
  readonly usdPerMonth: number;
}

/** What people actually pay today — the number the whole page is measured against. */
export const CONSUMER_TIERS: readonly Tier[] = [
  { vendor: 'OpenAI', name: 'ChatGPT Plus', usdPerMonth: 20 },
  { vendor: 'OpenAI', name: 'ChatGPT Pro', usdPerMonth: 200 },
  { vendor: 'Anthropic', name: 'Claude Pro', usdPerMonth: 20 },
  { vendor: 'Anthropic', name: 'Claude Max', usdPerMonth: 100 },
];

/** The reference price. $20/mo is the tier nearly everyone means by "I pay for AI". */
export const REFERENCE_PRICE_PER_MONTH: Sourced<number> = {
  value: 20,
  asOf: '2026-09-11',
  source: SOURCES.openaiPricing,
  note: 'The standard consumer tier at both OpenAI and Anthropic.',
};

export const CONSUMER_TIERS_SOURCE: Sourced<readonly Tier[]> = {
  value: CONSUMER_TIERS,
  asOf: '2026-09-11',
  source: SOURCES.anthropicPricing,
};
