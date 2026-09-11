import type { Source } from './types';

/**
 * One registry so a source is cited identically everywhere it appears,
 * and the Outro can enumerate them without hunting through the codebase.
 */
export const SOURCES = {
  epochCapex: {
    label: 'Epoch AI — Hyperscaler capex trend',
    url: 'https://epoch.ai/data-insights/hyperscaler-capex-trend',
  },
  epochRevenue: {
    label: 'Epoch AI — Anthropic & OpenAI revenue',
    url: 'https://epoch.ai/data-insights/anthropic-openai-revenue',
  },
  goldmanTrillion: {
    label: 'Goldman Sachs — Global AI investment to exceed $1T in 2026',
    url: 'https://www.goldmansachs.com/insights/articles/global-investment-is-forecast-to-exceed-1-trillion-in-2026',
  },
  dcRichness: {
    label: 'Data Center Richness — Hyperscalers plan $630B in 2026 capex',
    url: 'https://datacenterrichness.substack.com/p/hyperscalers-plan-630-billion-in',
  },
  platformonomics: {
    label: 'Platformonomics — Follow the CAPEX, 2025 retrospective',
    url: 'https://platformonomics.com/2026/02/follow-the-capex-2025-retrospective/',
  },
  sherwoodCapex: {
    label: 'Sherwood News — $700B+ hyperscaler capex in 2026',
    url: 'https://sherwood.news/tech/alphabet-amazon-microsoft-meta-plan-more-than-700-billion-on-capex-this-year/',
  },
  techcrunchAnthropic: {
    label: 'TechCrunch — Anthropic annualized revenue reaches $65B',
    url: 'https://techcrunch.com/2026/08/17/anthropics-annualized-revenue-surges-to-65b/',
  },
  sacraOpenAI: {
    label: 'Sacra — OpenAI revenue, valuation & funding',
    url: 'https://sacra.com/c/openai/',
  },
  valueAddOpenAI: {
    label: 'ValueAdd VC — OpenAI hits $40B ARR',
    url: 'https://valueaddvc.com/blog/openai-revenue-2026-20b-arr-4b-month-path-to-profitability',
  },
  pinggyFunding: {
    label: 'Pinggy — OpenAI & Anthropic funding history',
    url: 'https://pinggy.io/blog/openai_anthropic_funding_history/',
  },
  openaiPricing: {
    label: 'OpenAI — ChatGPT pricing',
    url: 'https://openai.com/chatgpt/pricing/',
  },
  anthropicPricing: {
    label: 'Anthropic — Claude pricing',
    url: 'https://www.anthropic.com/pricing',
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;
