import { GapBars } from '../charts/GapBars';
import { AnimatedCounter } from '../charts/AnimatedCounter';
import { ChapterShell } from './ChapterShell';
import { SourceTag } from '../components/SourceTag';
import { formatMultiple, formatUsd } from '../lib/model';
import { BASELINE_RESULT } from '../state/useAssumptions';
import { CHATGPT_PAID_SUBSCRIBERS, GLOBAL_AI_USERS, REFERENCE_PRICE } from '../data';

const PAID_PER_YEAR = REFERENCE_PRICE * 12;

/**
 * The reveal. Two framings, in order, because the second is the honest one
 * and only lands once the first has been seen: spread the bill across
 * everyone, then across the people who actually hand over money.
 */
export function Chapter2Gap() {
  const r = BASELINE_RESULT;

  return (
    <ChapterShell id="gap" scrub={2.5}>
      {(p) => {
        // First half of the scroll grows the "everyone pays" bar,
        // second half switches to the "only payers pay" framing.
        const phase = p < 0.5 ? 0 : 1;
        const local = phase === 0 ? p / 0.5 : (p - 0.5) / 0.5;

        const needed = phase === 0 ? r.perUserPerYear : r.perPayingUserPerYear;
        const label =
          phase === 0
            ? 'If every user paid an equal share'
            : 'If only the people who already pay, pay';

        return (
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              So what is your share?
            </h2>

            <p className="mt-4 max-w-2xl text-[var(--color-ink-2)]">
              {phase === 0 ? (
                <>
                  Spread the build across every one of the roughly{' '}
                  <span className="tabular font-semibold">1.2 billion</span>{' '}
                  people using an AI assistant
                  <SourceTag source={GLOBAL_AI_USERS.source} asOf={GLOBAL_AI_USERS.asOf} />,
                  give it five years to come back, and leave a thirty percent
                  margin.
                </>
              ) : (
                <>
                  But most of those people pay nothing. Only about{' '}
                  <span className="tabular font-semibold">5.6%</span> of active
                  users subscribe
                  <SourceTag
                    source={CHATGPT_PAID_SUBSCRIBERS.source}
                    asOf={CHATGPT_PAID_SUBSCRIBERS.asOf}
                  />
                  , so the whole bill lands on them.
                </>
              )}
            </p>

            <div className="mt-10">
              <GapBars
                paidPerYear={PAID_PER_YEAR}
                neededPerYear={needed}
                neededLabel={label}
                progress={local}
              />
            </div>

            <div className="mt-10 border-t border-[var(--color-hairline)] pt-8">
              <div className="text-sm text-[var(--color-muted)]">
                {phase === 0 ? 'Per user, per month' : 'Per paying user, per month'}
              </div>
              <div className="tabular mt-2 text-5xl font-semibold text-[var(--color-series-2)] sm:text-7xl">
                <AnimatedCounter
                  value={(needed / 12) * local}
                  format={(n) => formatUsd(n)}
                  duration={0}
                />
              </div>
              <div className="mt-3 text-lg text-[var(--color-ink-2)]">
                against the{' '}
                <span className="tabular text-[var(--color-series-1)]">
                  {formatUsd(REFERENCE_PRICE)}
                </span>{' '}
                actually charged —{' '}
                <span className="tabular font-semibold">
                  {formatMultiple(needed / PAID_PER_YEAR)}
                </span>{' '}
                the price.
              </div>
            </div>
          </div>
        );
      }}
    </ChapterShell>
  );
}
