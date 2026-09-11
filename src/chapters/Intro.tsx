import { REFERENCE_PRICE_PER_MONTH } from '../data';
import { SourceTag } from '../components/SourceTag';

export function Intro() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
          The bill for the boom
        </p>

        <h1 className="mt-6 text-5xl font-semibold leading-[1.05] sm:text-7xl">
          You pay{' '}
          <span className="tabular text-[var(--color-series-1)]">
            ${REFERENCE_PRICE_PER_MONTH.value}
          </span>{' '}
          a month.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-ink-2)]">
          Building the thing you pay for has cost, so far, more than a trillion
          dollars
          <SourceTag source={REFERENCE_PRICE_PER_MONTH.source} asOf={REFERENCE_PRICE_PER_MONTH.asOf} />.
          Someone has to earn that back.
        </p>

        <p className="mt-10 text-sm text-[var(--color-muted)]">Scroll.</p>
      </div>
    </section>
  );
}
