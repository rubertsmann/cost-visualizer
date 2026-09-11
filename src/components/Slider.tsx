import { useId } from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
  /** Shown under the control — why this number is what it is. */
  hint?: string;
  /** Set when the value no longer matches the researched baseline. */
  changed?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
  changed,
}: Props) {
  const id = useId();

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-[var(--color-ink-2)]">
          {label}
          {changed && (
            <span
              className="ml-2 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
              /* Not color alone: the word "edited" carries the state. */
            >
              edited
            </span>
          )}
        </label>
        <output htmlFor={id} className="tabular text-base font-semibold text-[var(--color-ink)]">
          {format(value)}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-series-1)]"
      />

      {hint && <p className="mt-2 text-xs text-[var(--color-muted)]">{hint}</p>}
    </div>
  );
}
