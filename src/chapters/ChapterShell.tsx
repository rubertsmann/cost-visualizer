import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore, type ChapterId } from '../state/useScrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  id: ChapterId;
  /** Extra scroll distance to spend pinned, as a multiple of viewport height. */
  scrub?: number;
  /** Rendered with the chapter's own 0..1 progress. */
  children: (progress: number) => ReactNode;
  className?: string;
}

/**
 * Owns every pin/scrub concern so chapters only describe content.
 *
 * Under reduced motion nothing pins and nothing scrubs: the chapter renders
 * at full progress as an ordinary block in the document flow, so the whole
 * argument is readable by scrolling normally.
 */
export function ChapterShell({ id, scrub = 1.5, children, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const store = useScrollStore.getState();

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: `+=${scrub * 100}%`,
      pin: true,
      pinSpacing: true,
      // anticipatePin avoids the one-frame jump as the pin engages.
      anticipatePin: 1,
      onUpdate: (self) => {
        setProgress(self.progress);
        store.setProgress(self.progress);
      },
      onToggle: (self) => {
        if (self.isActive) store.setChapter(id);
      },
    });

    // kill(true) reverts the pin spacer as well. Without the revert, toggling
    // motion off would leave the spacer's scroll height behind as dead space.
    return () => {
      trigger.kill(true);
      ScrollTrigger.refresh();
    };
  }, [id, scrub, reduced]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative flex min-h-screen w-full items-center justify-center px-6 py-20 ${className}`}
    >
      <div className="w-full max-w-5xl">{children(progress)}</div>
    </section>
  );
}
