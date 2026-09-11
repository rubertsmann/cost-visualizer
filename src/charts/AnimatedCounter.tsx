import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

interface Props {
  value: number;
  format: (n: number) => string;
  /** Milliseconds for a full tween. */
  duration?: number;
  className?: string;
}

/** Ease-out cubic: fast commitment, slow settle — the number lands rather than stops. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Tweens to `value` on its own rAF rather than through React state per frame.
 * The DOM text is written directly; React only re-renders when the target
 * changes, which matters when sliders drive this at 60fps.
 */
export function AnimatedCounter({ value, format, duration = 1200, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const reduced = useReducedMotion();
  // Render the final string on the server/first paint so the number is never
  // missing for a reader who does not animate.
  const [initial] = useState(() => format(reduced ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced || duration <= 0) {
      el.textContent = format(value);
      from.current = value;
      return;
    }

    const start = performance.now();
    const a = from.current;
    const b = value;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = a + (b - a) * ease(t);
      el.textContent = format(current);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        from.current = b;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, format, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
