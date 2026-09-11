import {
  ANTHROPIC_ARR_SOURCE,
  BIG_FIVE_CAPEX_SOURCE,
  CHATGPT_PAID_SUBSCRIBERS,
  CHATGPT_WEEKLY_ACTIVE,
  CONSUMER_TIERS_SOURCE,
  GLOBAL_AI_INVESTMENT_2026,
  GLOBAL_AI_USERS,
  OPENAI_ARR_SOURCE,
  PAID_CONVERSION_RATE,
  PLAYERS_SOURCE,
  REFERENCE_PRICE_PER_MONTH,
  type Sourced,
} from '../data';

const CITED: readonly { what: string; s: Sourced<unknown> }[] = [
  { what: 'Big Five annual capital expenditure, 2022–2026', s: BIG_FIVE_CAPEX_SOURCE },
  { what: '2026 capex guidance, per company', s: PLAYERS_SOURCE },
  { what: 'Global AI investment, 2026', s: GLOBAL_AI_INVESTMENT_2026 },
  { what: 'OpenAI annualized revenue', s: OPENAI_ARR_SOURCE },
  { what: 'Anthropic annualized revenue', s: ANTHROPIC_ARR_SOURCE },
  { what: 'ChatGPT weekly active users', s: CHATGPT_WEEKLY_ACTIVE },
  { what: 'ChatGPT paid subscribers', s: CHATGPT_PAID_SUBSCRIBERS },
  { what: 'Global AI assistant users', s: GLOBAL_AI_USERS },
  { what: 'Paid conversion rate', s: PAID_CONVERSION_RATE },
  { what: 'Consumer subscription price', s: REFERENCE_PRICE_PER_MONTH },
  { what: 'Consumer tiers', s: CONSUMER_TIERS_SOURCE },
];

export function Outro() {
  return (
    <section id="outro" className="w-full border-t border-[var(--color-hairline)] px-6 py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-3xl font-semibold">Where every number came from</h2>

        <p className="mt-4 max-w-2xl text-[var(--color-ink-2)]">
          This is a break-even thought experiment, not a forecast. It does not
          predict prices, and it assumes the money has to come back from users
          at all — plenty of it may instead come back from enterprise contracts,
          advertising, or never.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <th scope="col" className="py-3 pr-4 font-semibold">Figure</th>
                <th scope="col" className="py-3 pr-4 font-semibold">As of</th>
                <th scope="col" className="py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {CITED.map(({ what, s }) => (
                <tr key={what} className="border-b border-[var(--color-hairline)] align-top">
                  <td className="py-4 pr-4 text-[var(--color-ink)]">
                    {what}
                    {s.note && (
                      <div className="mt-1 text-xs text-[var(--color-muted)]">{s.note}</div>
                    )}
                  </td>
                  <td className="tabular py-4 pr-4 whitespace-nowrap text-[var(--color-ink-2)]">
                    {s.asOf}
                  </td>
                  <td className="py-4">
                    <a
                      href={s.source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[var(--color-series-1)] underline decoration-dotted underline-offset-2"
                    >
                      {s.source.label}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-[var(--color-muted)]">
          Capex figures are total capital expenditure, not AI-only. Revenue is
          annualized run-rate, which overstates a fast-growing year. Figures
          marked derived are arithmetic on cited inputs and are labelled as such
          in the data file. All of it moves; the as-of column is the honest part.
        </p>
      </div>
    </section>
  );
}
