import { Slider } from '../components/Slider';
import { GapBars } from '../charts/GapBars';
import { useAssumptions, useBreakEven } from '../state/useAssumptions';
import { formatCompactUsd, formatMultiple, formatUsd } from '../lib/model';
import { BASELINE, CUMULATIVE_CAPEX_USD, REFERENCE_PRICE } from '../data';

const BILLION = 1e9;
const MILLION = 1e6;

const pct = (n: number) => `${Math.round(n * 100)}%`;
const people = (n: number) =>
  n >= BILLION ? `${(n / BILLION).toFixed(1)}B` : `${Math.round(n / MILLION)}M`;

/**
 * The rebuttal chapter. Every default here is cited, and every default here
 * is wrong in someone's opinion — so the reader gets the controls. Nothing
 * is pinned: this one is meant to be sat with.
 */
export function Chapter3Calculator() {
  const { assumptions, set, reset, isPristine } = useAssumptions();
  const r = useBreakEven();
  const pristine = isPristine();

  const changed = <K extends keyof typeof BASELINE>(k: K) =>
    assumptions[k] !== BASELINE[k];

  return (
    <section id="calculator" className="w-full px-6 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-3xl font-semibold sm:text-4xl">Disagree with me.</h2>
        <p className="mt-4 max-w-2xl text-[var(--color-ink-2)]">
          Every number above is an assumption someone can argue with. These are
          the ones that matter. Move them and watch the answer move.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Assumptions
              </h3>
              <button
                type="button"
                onClick={reset}
                disabled={pristine}
                className="rounded-md border border-[var(--color-hairline)] px-3 py-1.5 text-xs text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ↻ Reset to researched values
              </button>
            </div>

            <div className="divide-y divide-[var(--color-hairline)]">
              <Slider
                label="Capital to repay"
                value={assumptions.totalCapexUsd}
                min={100 * BILLION}
                max={5000 * BILLION}
                step={10 * BILLION}
                format={formatCompactUsd}
                onChange={(totalCapexUsd) => set({ totalCapexUsd })}
                changed={changed('totalCapexUsd')}
                hint={`Baseline is ${formatCompactUsd(CUMULATIVE_CAPEX_USD)} — Big Five capex, 2022 to 2026.`}
              />
              <Slider
                label="People to spread it across"
                value={assumptions.activeUsers}
                min={100 * MILLION}
                max={5000 * MILLION}
                step={50 * MILLION}
                format={people}
                onChange={(activeUsers) => set({ activeUsers })}
                changed={changed('activeUsers')}
                hint="Humans, not accounts. One person using three assistants still pays one set of bills."
              />
              <Slider
                label="Years to earn it back"
                value={assumptions.paybackYears}
                min={1}
                max={20}
                step={1}
                format={(n) => `${n} yr`}
                onChange={(paybackYears) => set({ paybackYears })}
                changed={changed('paybackYears')}
                hint="Longer is kinder. Data centre hardware depreciates over roughly five to six."
              />
              <Slider
                label="Share of users who pay"
                value={assumptions.paidConversionRate}
                min={0.01}
                max={1}
                step={0.01}
                format={pct}
                onChange={(paidConversionRate) => set({ paidConversionRate })}
                changed={changed('paidConversionRate')}
                hint="The single biggest lever on the page. Free users do not stop costing money."
              />
              <Slider
                label="Target operating margin"
                value={assumptions.targetMargin}
                min={0}
                max={0.9}
                step={0.05}
                format={pct}
                onChange={(targetMargin) => set({ targetMargin })}
                changed={changed('targetMargin')}
                hint="Set this to zero to ask only for break-even, with no profit at all."
              />
              <Slider
                label="Serving cost per user, per year"
                value={assumptions.opexPerUserYearUsd}
                min={0}
                max={200}
                step={1}
                format={(n) => formatUsd(n)}
                onChange={(opexPerUserYearUsd) => set({ opexPerUserYearUsd })}
                changed={changed('opexPerUserYearUsd')}
                hint="Inference and bandwidth, on top of repaying the build."
              />
            </div>
          </div>

          <div>
            <Result r={r} />
            <div className="mt-10">
              <GapBars
                paidPerYear={REFERENCE_PRICE * 12}
                neededPerYear={r.perPayingUserPerYear}
                neededLabel="Needed, per paying user"
              />
            </div>
            {!pristine && (
              <p className="mt-6 text-xs text-[var(--color-muted)]">
                You have changed the assumptions. These are your numbers now,
                not the researched ones.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ r }: { r: ReturnType<typeof useBreakEven> }) {
  return (
    <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6">
      <div className="text-sm text-[var(--color-muted)]">Per paying user</div>
      <div className="tabular mt-2 text-5xl font-semibold text-[var(--color-series-2)]">
        {formatUsd(r.perPayingUserPerMonth)}
        <span className="text-xl font-normal text-[var(--color-muted)]"> / mo</span>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--color-hairline)] pt-6 text-sm">
        <Cell label="Per active user, per year" value={formatUsd(r.perUserPerYear)} />
        <Cell label="Per active user, per day" value={formatUsd(r.perUserPerDay, { cents: true })} />
        <Cell
          label="Multiple of today's price"
          value={formatMultiple(r.perPayingUserPerYear / (REFERENCE_PRICE * 12))}
        />
        <Cell
          label="Annual shortfall, everyone"
          value={r.isCovered ? 'covered' : formatCompactUsd(r.annualShortfallUsd)}
          tone={r.isCovered ? 'var(--color-good)' : 'var(--color-critical)'}
        />
      </dl>
    </div>
  );
}

function Cell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
      <dd
        className="tabular mt-1 text-xl font-semibold"
        style={{ color: tone ?? 'var(--color-ink)' }}
      >
        {value}
      </dd>
    </div>
  );
}
