import { create } from 'zustand';
import { BASELINE, REFERENCE_PRICE } from '../data';
import { computeBreakEven, type Assumptions, type BreakEven } from '../lib/model';

interface AssumptionsState {
  assumptions: Assumptions;
  /** The sticker price we measure against; adjustable alongside the rest. */
  referencePrice: number;
  set: (patch: Partial<Assumptions>) => void;
  setReferencePrice: (usdPerMonth: number) => void;
  reset: () => void;
  /** True while every value still matches the researched baseline. */
  isPristine: () => boolean;
}

const initial: Assumptions = { ...BASELINE };

export const useAssumptions = create<AssumptionsState>((set, get) => ({
  assumptions: initial,
  referencePrice: REFERENCE_PRICE,
  set: (patch) =>
    set((s) => ({ assumptions: { ...s.assumptions, ...patch } })),
  setReferencePrice: (usdPerMonth) => set({ referencePrice: usdPerMonth }),
  reset: () => set({ assumptions: { ...BASELINE }, referencePrice: REFERENCE_PRICE }),
  isPristine: () => {
    const { assumptions, referencePrice } = get();
    if (referencePrice !== REFERENCE_PRICE) return false;
    return (Object.keys(BASELINE) as (keyof Assumptions)[]).every(
      (k) => assumptions[k] === BASELINE[k],
    );
  },
}));

/** Derived break-even for the current assumptions. */
export function useBreakEven(): BreakEven {
  const assumptions = useAssumptions((s) => s.assumptions);
  const referencePrice = useAssumptions((s) => s.referencePrice);
  return computeBreakEven(assumptions, referencePrice);
}

/** The researched baseline result, for "here is what changed" comparisons. */
export const BASELINE_RESULT = computeBreakEven({ ...BASELINE }, REFERENCE_PRICE);
