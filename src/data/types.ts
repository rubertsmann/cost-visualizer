/** A published source we can point a reader at. */
export interface Source {
  /** Short label shown in the UI, e.g. "Epoch AI". */
  readonly label: string;
  readonly url: string;
}

/**
 * Every number on this page carries where it came from and when it was true.
 * The figures move fast; `asOf` is what keeps the page honest as they do.
 */
export interface Sourced<T> {
  readonly value: T;
  /** ISO date the figure was reported or last verified. */
  readonly asOf: string;
  readonly source: Source;
  /** Caveats: projections, derived values, definitional quirks. */
  readonly note?: string;
}

/** Confidence in a figure. Projections are drawn differently from actuals. */
export type Certainty = 'actual' | 'guidance' | 'projection' | 'derived';

export interface YearPoint {
  readonly year: number;
  /** US dollars, absolute (not billions). */
  readonly usd: number;
  readonly certainty: Certainty;
}

export interface DatedPoint {
  /** ISO date. */
  readonly date: string;
  /** US dollars, absolute. */
  readonly usd: number;
}

export const BILLION = 1e9;
export const TRILLION = 1e12;
