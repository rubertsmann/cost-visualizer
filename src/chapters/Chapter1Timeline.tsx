import { CapexChart } from '../charts/CapexChart';
import { AnimatedCounter } from '../charts/AnimatedCounter';
import { ChapterShell } from './ChapterShell';
import { SourceTag } from '../components/SourceTag';
import { formatCompactUsd } from '../lib/model';
import {
  BIG_FIVE_CAPEX,
  BIG_FIVE_CAPEX_SOURCE,
  COMBINED_LAB_ARR_USD,
  CUMULATIVE_CAPEX_USD,
} from '../data';

const LATEST = BIG_FIVE_CAPEX.at(-1);

export function Chapter1Timeline() {
  return (
    <ChapterShell id="timeline" scrub={2}>
      {(p) => (
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            The money went in first.
          </h2>

          <p className="mt-4 max-w-2xl text-[var(--color-ink-2)]">
            Alphabet, Amazon, Meta, Microsoft and Oracle spent{' '}
            <span className="tabular font-semibold text-[var(--color-series-1)]">
              {formatCompactUsd(CUMULATIVE_CAPEX_USD)}
            </span>{' '}
            on capital projects between 2022 and 2026
            <SourceTag source={BIG_FIVE_CAPEX_SOURCE.source} asOf={BIG_FIVE_CAPEX_SOURCE.asOf} />.
            The two largest AI labs, combined, currently earn{' '}
            <span className="tabular font-semibold text-[var(--color-series-2)]">
              {formatCompactUsd(COMBINED_LAB_ARR_USD)}
            </span>{' '}
            a year. Both lines are dollars, on the same axis.
          </p>

          <div className="mt-8">
            <CapexChart progress={p} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <Stat
              label={`Big Five capex, ${LATEST?.year ?? 2026}`}
              value={<AnimatedCounter value={(LATEST?.usd ?? 0) * p} format={formatCompactUsd} duration={0} />}
              tone="var(--color-series-1)"
            />
            <Stat
              label="Combined lab revenue"
              value={<AnimatedCounter value={COMBINED_LAB_ARR_USD * p} format={formatCompactUsd} duration={0} />}
              tone="var(--color-series-2)"
            />
            <Stat
              label="Spent per revenue dollar"
              value={`$${((LATEST?.usd ?? 0) / COMBINED_LAB_ARR_USD).toFixed(2)}`}
              tone="var(--color-ink)"
            />
          </div>

          <p className="mt-6 max-w-2xl text-xs text-[var(--color-muted)]">
            Capex here is total capital expenditure, not AI alone — these firms
            build ordinary cloud capacity too. Revenue is annualized run-rate,
            which flatters a fast grower. Chapter three lets you discount both.
          </p>
        </div>
      )}
    </ChapterShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone: string;
}) {
  return (
    <div>
      <div className="tabular text-2xl font-semibold sm:text-3xl" style={{ color: tone }}>
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
