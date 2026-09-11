import {
  setMotionPreference,
  useMotionPreference,
  useReducedMotion,
  type MotionPreference,
} from '../lib/useReducedMotion';

const OPTIONS: readonly { value: MotionPreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
];

/**
 * Fixed, small, and out of the reading column. Present from the first
 * screen so someone who needs it does not have to scroll through the
 * effects to find the control that turns them off.
 */
export function MotionToggle() {
  const preference = useMotionPreference();
  const reduced = useReducedMotion();

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)]/90 px-1.5 py-1 backdrop-blur">
      <span className="px-1.5 text-[11px] text-[var(--color-muted)]">Motion</span>
      {OPTIONS.map((o) => {
        const active = preference === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setMotionPreference(o.value)}
            aria-pressed={active}
            className={`rounded-full px-2 py-0.5 text-[11px] transition-colors ${
              active
                ? 'bg-[var(--color-series-1)] text-white'
                : 'text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
      <span className="sr-only" role="status">
        {reduced ? 'Motion effects are off' : 'Motion effects are on'}
      </span>
    </div>
  );
}
