import { formatUsd } from '../lib/model';

interface Props {
  /** What a user pays today, per year. */
  paidPerYear: number;
  /** What the model says it would take, per year. */
  neededPerYear: number;
  /** Label for the "needed" bar — the framing changes between chapters. */
  neededLabel: string;
  /** 0..1 — grows the needed bar as the reveal scrubs. */
  progress?: number;
}

const BAR_H = 56;
const RADIUS = 4;

/**
 * Two bars, one axis, anchored to a shared baseline at zero. The whole
 * argument of the page is the ratio between their lengths, so nothing else
 * competes for attention here.
 *
 * No CSS transition on the width: both callers already drive this
 * continuously (scroll scrub, slider input), so a transition only adds lag
 * behind the pointer and leaves the bar reading a stale value mid-flight.
 */
export function GapBars({ paidPerYear, neededPerYear, neededLabel, progress = 1 }: Props) {
  const grown = neededPerYear * progress;
  const max = Math.max(paidPerYear, neededPerYear, 1);

  const rows = [
    { label: 'What you pay today', value: paidPerYear, color: 'var(--color-series-1)' },
    { label: neededLabel, value: grown, color: 'var(--color-series-2)' },
  ];

  return (
    <div className="w-full">
      {rows.map((r) => (
        <div key={r.label} className="mb-6 last:mb-0">
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <span className="text-sm text-[var(--color-ink-2)]">{r.label}</span>
            <span className="tabular text-lg font-semibold" style={{ color: r.color }}>
              {formatUsd(r.value)}
              <span className="text-sm font-normal text-[var(--color-muted)]"> / yr</span>
            </span>
          </div>
          {/* The track is the zero baseline both bars are measured from. */}
          <div
            className="w-full overflow-hidden rounded-[4px] bg-[var(--color-surface-2)]"
            style={{ height: BAR_H }}
          >
            <div
              className="h-full"
              style={{
                width: `${Math.max(0, Math.min(100, (r.value / max) * 100))}%`,
                backgroundColor: r.color,
                borderRadius: RADIUS,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
