import type { ScaleLinear, ScaleTime } from 'd3-scale';

interface XAxisProps {
  scale: ScaleTime<number, number> | ScaleLinear<number, number>;
  ticks: readonly (Date | number)[];
  format: (v: never) => string;
  innerHeight: number;
}

/** Recessive axes: a hairline baseline, muted ticks, no chartjunk. */
export function XAxis({ scale, ticks, format, innerHeight }: XAxisProps) {
  return (
    <g transform={`translate(0,${innerHeight})`} aria-hidden="true">
      <line x1={0} x2={scale.range()[1]} stroke="var(--color-axis)" strokeWidth={1} />
      {ticks.map((t, i) => (
        <text
          key={i}
          x={(scale as (v: unknown) => number)(t)}
          y={20}
          textAnchor="middle"
          className="tabular"
          fill="var(--color-muted)"
          fontSize={12}
        >
          {format(t as never)}
        </text>
      ))}
    </g>
  );
}

interface YAxisProps {
  scale: ScaleLinear<number, number>;
  ticks: readonly number[];
  format: (v: number) => string;
  innerWidth: number;
}

export function YAxis({ scale, ticks, format, innerWidth }: YAxisProps) {
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
