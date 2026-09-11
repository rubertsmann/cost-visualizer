import type { ScaleLinear } from 'd3-scale';

interface AxisProps {
  scale: ScaleLinear<number, number>;
  ticks: readonly number[];
  format: (v: number) => string;
}

/** Recessive axes: a hairline baseline, muted ticks, no chartjunk. */
export function XAxis({
  scale,
  ticks,
  format,
  innerHeight,
  innerWidth,
}: AxisProps & { innerHeight: number; innerWidth: number }) {
  return (
    <g transform={`translate(0,${innerHeight})`} aria-hidden="true">
      <line x1={0} x2={innerWidth} stroke="var(--color-axis)" strokeWidth={1} />
      {ticks.map((t) => (
        <text
          key={t}
          x={scale(t)}
          y={20}
          textAnchor="middle"
          className="tabular"
          fill="var(--color-muted)"
          fontSize={12}
        >
          {format(t)}
        </text>
      ))}
    </g>
  );
}

export function YAxis({
  scale,
  ticks,
  format,
  innerWidth,
}: AxisProps & { innerWidth: number }) {
  return (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t} transform={`translate(0,${scale(t)})`}>
          <line x2={innerWidth} stroke="var(--color-grid)" strokeWidth={1} />
          <text
            x={-10}
            dy="0.32em"
            textAnchor="end"
            className="tabular"
            fill="var(--color-muted)"
            fontSize={12}
          >
            {format(t)}
          </text>
        </g>
      ))}
    </g>
  );
}
