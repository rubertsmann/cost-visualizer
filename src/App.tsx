import { Suspense, lazy } from 'react';
import { MotionToggle } from './components/MotionToggle';
import { useReducedMotion } from './lib/useReducedMotion';
import { Calculator } from './views/Calculator';

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
    <div className="relative min-h-screen">
      <MotionToggle />
      {!reduced && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}
      <main className="relative z-10">
        <Calculator />
      </main>
    </div>
  );
}
