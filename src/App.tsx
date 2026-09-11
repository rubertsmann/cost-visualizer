import { SceneCanvas } from './scene/SceneCanvas';
import { Intro } from './chapters/Intro';
import { Chapter1Timeline } from './chapters/Chapter1Timeline';
import { Chapter2Gap } from './chapters/Chapter2Gap';
import { Chapter3Calculator } from './chapters/Chapter3Calculator';
import { Outro } from './chapters/Outro';

export default function App() {
  return (
    <div className="relative">
      <SceneCanvas />
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
