import { Suspense, lazy } from 'react';
import { MotionToggle } from './components/MotionToggle';
import { useReducedMotion } from './lib/useReducedMotion';

import { Intro } from './chapters/Intro';
import { Chapter1Timeline } from './chapters/Chapter1Timeline';
import { Chapter2Gap } from './chapters/Chapter2Gap';
import { Chapter3Calculator } from './chapters/Chapter3Calculator';
import { Outro } from './chapters/Outro';

/*
 * three.js is the heaviest dependency on the page and the scene is purely
 * decorative, so it loads on its own chunk after the content. A reader on
 * reduced motion never downloads it at all.
 */
const SceneCanvas = lazy(() =>
  import('./scene/SceneCanvas').then((m) => ({ default: m.SceneCanvas })),
);

export default function App() {
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      <MotionToggle />
      {!reduced && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}
      <main className="relative z-10">
        <Intro />
        <Chapter1Timeline />
        <Chapter2Gap />
        <Chapter3Calculator />
        <Outro />
      </main>
    </div>
  );
}
