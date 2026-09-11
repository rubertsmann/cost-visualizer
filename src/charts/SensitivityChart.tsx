import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { curveMonotoneX, line } from 'd3-shape';
import { XAxis, YAxis } from './Axis';
import { useChartDims } from './useChartDims';
import { computeBreakEven, formatUsd, type Assumptions } from '../lib/model';

const MARGIN = { top: 22, right: 22, bottom: 38, left: 66 };

const MIN_YEARS = 1;
const MAX_YEARS = 20;
const STEP = 0.5;

interface Props {
  assumptions: Assumptions;
  referencePrice: number;
}

interface Point {
  years: number;
  usdPerMonth: number;
}

/**
 * The whole model as one curve: what a paying user would owe each month if
 * the build had to be repaid over N years, under the assumptions currently
 * set.
 *
 * Payback period is the x-axis because it is the only input with an obvious
 * reasonable range. Every other slider reshapes the curve rather than moving
 * along it, so a change anywhere on the panel shows up here immediately.
 */
export function SensitivityChart({ assumptions, referencePrice }: Props) {
  const [ref, dims] = useChartDims(MARGIN, 0.66, 380);
  const { innerWidth, innerHeight } = dims;

  const { points, current } = useMemo(() => {
    const points: Point[] = [];
    for (let years = MIN_YEARS; years <= MAX_YEARS + 1e-9; years += STEP) {
      points.push({
        years,
        usdPerMonth: computeBreakEven({ ...assumptions, paybackYears: years }, referencePrice)
          .perPayingUserPerMonth,
      });
    }
    const current = computeBreakEven(assumptions, referencePrice).perPayingUserPerMonth;
    return { points, current };
  }, [assumptions, referencePrice]);

  const { x, y, path, yTicks, xTicks } = useMemo(() => {
    const x = scaleLinear().domain([MIN_YEARS, MAX_YEARS]).range([0, innerWidth]);

    // Include the reference price in the domain so the $20 line is always on
    // screen — otherwise it slides off the bottom and the comparison is lost.
    const peak = points[0]?.usdPerMonth ?? 0;
    const y = scaleLinear()
      .domain([0, Math.max(peak, referencePrice) * 1.08])
      .nice()
      .range([innerHeight, 0]);

    const path =
      line<Point>()
        .x((d) => x(d.years))
        .y((d) => y(d.usdPerMonth))
        .curve(curveMonotoneX)(points) ?? '';

    return { x, y, path, yTicks: y.ticks(5), xTicks: [1, 5, 10, 15, 20] };
  }, [points, innerWidth, innerHeight, referencePrice]);

  const clampedYears = Math.min(MAX_YEARS, Math.max(MIN_YEARS, assumptions.paybackYears));
  const markerX = x(clampedYears);
  const markerY = y(current);
  const refY = y(referencePrice);
  const labelLeft = markerX > innerWidth * 0.6;

  return (
    <figure ref={ref} className="m-0 w-full">
      <figcaption className="mb-3 text-sm text-[var(--color-ink-2)]">
        Required monthly price per paying user, by payback period
      </figcaption>

      {innerWidth > 0 && (
        <svg
          width={dims.width}
          height={dims.height}
          role="img"
          aria-label={`Required monthly price per paying user falls from ${formatUsd(
            points[0]?.usdPerMonth ?? 0,
          )} at a one-year payback to ${formatUsd(
            points.at(-1)?.usdPerMonth ?? 0,
          )} at twenty years. At the current setting of ${clampedYears} years it is ${formatUsd(
            current,
          )} per month, against a reference price of ${formatUsd(referencePrice)}.`}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            <YAxis scale={y} ticks={yTicks} format={(v) => formatUsd(v)} innerWidth={innerWidth} />

            {/* What people actually pay, for the curve to be measured against. */}
            <g>
              <line
                x1={0}
                x2={innerWidth}
                y1={refY}
                y2={refY}
                stroke="var(--color-series-1)"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <text
                x={innerWidth}
                y={refY - 8}
                textAnchor="end"
                className="tabular"
                fill="var(--color-series-1)"
                fontSize={12}
                fontWeight={600}
              >
                {formatUsd(referencePrice)} charged today
              </text>
            </g>

            <path
              d={path}
              fill="none"
              stroke="var(--color-series-2)"
              strokeWidth={2}
              strokeLinecap="round"
            />

            {/* Where the sliders currently sit on that curve. */}
            <line
              x1={markerX}
              x2={markerX}
              y1={markerY}
              y2={innerHeight}
              stroke="var(--color-series-2)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.55}
            />
            <circle
              cx={markerX}
              cy={markerY}
              r={5}
              fill="var(--color-series-2)"
              stroke="var(--color-plane)"
              strokeWidth={2}
            />
            <text
              x={labelLeft ? markerX - 12 : markerX + 12}
              y={markerY - 10}
              textAnchor={labelLeft ? 'end' : 'start'}
              className="tabular"
              fill="var(--color-series-2)"
              fontSize={14}
              fontWeight={600}
            >
              {formatUsd(current)}/mo
            </text>

            <XAxis
              scale={x}
              ticks={xTicks}
              format={(v) => `${v}y`}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
            />
          </g>
        </svg>
      )}

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 p-0 text-xs text-[var(--color-ink-2)]">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-5 rounded-full"
            style={{ backgroundColor: 'var(--color-series-2)' }}
          />
          Needed per paying user
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-5 rounded-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--color-series-1) 0 5px, transparent 5px 9px)',
            }}
          />
          Charged today
        </li>
      </ul>
    </figure>
  );
}
