import { useEffect, useRef, useState } from 'react';

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartDims {
  width: number;
  height: number;
  margin: Margins;
  /** Plot area, margins already subtracted. */
  innerWidth: number;
  innerHeight: number;
}

/**
 * Charts here are responsive by measurement rather than by viewBox scaling:
 * a scaled viewBox would stretch the type and the 2px mark widths along with
 * the geometry, and both are specified in real pixels.
 */
export function useChartDims(
  margin: Margins,
  aspect = 0.5,
  maxHeight = 520,
): [React.RefObject<HTMLDivElement | null>, ChartDims] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = Math.min(maxHeight, Math.max(220, width * aspect));

  return [
    ref,
    {
      width,
      height,
      margin,
      innerWidth: Math.max(0, width - margin.left - margin.right),
      innerHeight: Math.max(0, height - margin.top - margin.bottom),
    },
  ];
}
