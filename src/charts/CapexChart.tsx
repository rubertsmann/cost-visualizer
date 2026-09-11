import { useMemo } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { XAxis, YAxis } from './Axis';
import { useChartDims } from './useChartDims';
import { formatCompactUsd } from '../lib/model';
import {
  ANTHROPIC_ARR,
  BIG_FIVE_CAPEX,
  OPENAI_ARR,
  type DatedPoint,
  type YearPoint,
} from '../data';

const MARGIN = { top: 16, right: 16, bottom: 34, left: 60 };

interface Props {
  /** 0..1 — how much of the timeline has been drawn in. */
  progress: number;
}

const midYear = (y: number) => new Date(Date.UTC(y, 6, 1));
const parse = (p: DatedPoint) => new Date(`${p.date}T00:00:00Z`);

/**
 * Capex and lab revenue share ONE axis. They differ by an order of
 * magnitude, and that is the finding — a second y-scale would erase it.
 */
export function CapexChart({ progress }: Props) {
  const [ref, dims] = useChartDims(MARGIN, 0.46);
  const { innerWidth, innerHeight } = dims;

  const { x, y, capexArea, capexLine, openaiLine, anthropicLine, xTicks, yTicks, endLabels } =
    useMemo(() => {
      const x = scaleTime()
        .domain([new Date(Date.UTC(2022, 0, 1)), new Date(Date.UTC(2026, 11, 31))])
        .range([0, innerWidth]);
      const y = scaleLinear()
        .domain([0, 800e9])
        .nice()
        .range([innerHeight, 0]);

      const capexArea = area<YearPoint>()
        .x((d) => x(midYear(d.year)))
        .y0(innerHeight)
        .y1((d) => y(d.usd))
        .curve(curveMonotoneX);

      const capexLine = line<YearPoint>()
        .x((d) => x(midYear(d.year)))
        .y((d) => y(d.usd))
        .curve(curveMonotoneX);

      const arr = line<DatedPoint>()
        .x((d) => x(parse(d)))
        .y((d) => y(d.usd))
        .curve(curveMonotoneX);

      return {
        x,
        y,
        capexArea: capexArea(BIG_FIVE_CAPEX as YearPoint[]) ?? '',
        capexLine: capexLine(BIG_FIVE_CAPEX as YearPoint[]) ?? '',
        openaiLine: arr(OPENAI_ARR as DatedPoint[]) ?? '',
        anthropicLine: arr(ANTHROPIC_ARR as DatedPoint[]) ?? '',
        xTicks: [2022, 2023, 2024, 2025, 2026].map(midYear),
        yTicks: y.ticks(5),
        // The revenue lines sit almost on the baseline against a $800B axis.
        // That flatness IS the finding, so rather than rescale it away, label
        // the ends directly — otherwise a reader sees two lines and no values.
        endLabels: [
          { d: BIG_FIVE_CAPEX.at(-1), color: 'var(--color-series-1)', dy: -10 },
        ]
          .filter((e) => e.d)
          .map((e) => ({
            x: x(midYear(e.d!.year)),
            y: y(e.d!.usd),
            label: formatCompactUsd(e.d!.usd),
            color: e.color,
            dy: e.dy,
          }))
          .concat(
            (
              [
                // Offsets follow the values: the lower line labels below,
                // the higher one above, so the pair never crosses.
                { p: OPENAI_ARR.at(-1), color: 'var(--color-series-2)', dy: 18 },
                { p: ANTHROPIC_ARR.at(-1), color: 'var(--color-series-3)', dy: -10 },
              ] as const
            )
              .filter((e) => e.p)
              .map((e) => ({
                x: x(parse(e.p!)),
                y: y(e.p!.usd),
                label: formatCompactUsd(e.p!.usd),
                color: e.color,
                dy: e.dy,
              })),
          ),
      };
    }, [innerWidth, innerHeight]);

  const clipWidth = Math.max(0, innerWidth * progress);

  return (
    <figure ref={ref} className="w-full m-0">
      <figcaption className="sr-only">
        Annual capital expenditure of the five largest AI infrastructure
        builders, against the annualized revenue of OpenAI and Anthropic, on a
        single dollar axis.
      </figcaption>

      {innerWidth > 0 && (
        <svg
          width={dims.width}
          height={dims.height}
          role="img"
          aria-label="Big Five capital expenditure rising to 770 billion dollars in 2026, against OpenAI and Anthropic annualized revenue of 40 and 65 billion dollars."
        >
          <defs>
            <clipPath id="capex-reveal">
              <rect x={0} y={0} width={clipWidth} height={innerHeight} />
            </clipPath>
            <linearGradient id="capex-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-series-1)" stopOpacity={0.42} />
              <stop offset="100%" stopColor="var(--color-series-1)" stopOpacity={0.03} />
            </linearGradient>
          </defs>

          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            <YAxis scale={y} ticks={yTicks} format={formatCompactUsd} innerWidth={innerWidth} />

            <g clipPath="url(#capex-reveal)">
              <path d={capexArea} fill="url(#capex-fill)" />
              <path
                d={capexLine}
                fill="none"
                stroke="var(--color-series-1)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <path
                d={openaiLine}
                fill="none"
                stroke="var(--color-series-2)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <path
                d={anthropicLine}
                fill="none"
                stroke="var(--color-series-3)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              {endLabels.map((e) => (
                <g key={e.label + e.color}>
                  {/* 2px surface ring keeps the dot legible where lines overlap. */}
                  <circle
                    cx={e.x}
                    cy={e.y}
                    r={4}
                    fill={e.color}
                    stroke="var(--color-plane)"
                    strokeWidth={2}
                  />
                  <text
                    x={e.x}
                    y={e.y + e.dy}
                    textAnchor="end"
                    className="tabular"
                    fill={e.color}
                    fontSize={13}
                    fontWeight={600}
                  >
                    {e.label}
                  </text>
                </g>
              ))}
            </g>

            <XAxis
              scale={x}
              ticks={xTicks}
              format={(d: Date) => String(d.getUTCFullYear())}
              innerHeight={innerHeight}
            />
          </g>
        </svg>
      )}

      <Legend />
    </figure>
  );
}

const SERIES = [
  { label: 'Big Five capex', color: 'var(--color-series-1)' },
  { label: 'OpenAI revenue', color: 'var(--color-series-2)' },
  { label: 'Anthropic revenue', color: 'var(--color-series-3)' },
] as const;

function Legend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 list-none p-0 text-sm text-[var(--color-ink-2)]">
      {SERIES.map((s) => (
        <li key={s.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-5 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
}
