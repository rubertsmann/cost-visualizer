import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './moneyFlow.glsl';
import { useScrollStore } from '../state/useScrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';

/*
 * Field dimensions are matched to what the camera can actually see. At
 * z = 42 with a 55-degree vertical fov the near plane spans roughly +-22
 * vertically, widening to about +-58 at the back of the field, so a wider
 * spread than this just pays for particles nobody ever sees.
 */
const SPREAD = 34; // half-height of the wrap column
const WIDTH = 46; // half-width of the field
const DEPTH = 60;

/** Cut on smaller screens, which are likelier to be power-constrained. */
function particleCount(width: number): number {
  if (width < 700) return 9000;
  if (width < 1400) return 18000;
  return 30000;
}

function buildGeometry(count: number): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const depths = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * WIDTH * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 2;
    positions[i * 3 + 2] = -Math.random() * DEPTH;
    seeds[i] = Math.random();
    // Bias toward the NEAR plane. Far particles are both smaller and dimmer,
    // so weighting the field backwards spends most of the budget on dots too
    // faint to see against a near-black page.
    depths[i] = Math.pow(Math.random(), 1.7);
  }

  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(positions, 3));
  g.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  g.setAttribute('aDepth', new BufferAttribute(depths, 1));
  return g;
}

/**
 * The cinematic layer: a fixed, non-interactive particle field behind the
 * content. It reads scroll straight from the store inside its own rAF, so
 * scrolling never triggers a React render on account of the canvas.
 *
 * It is strictly decorative. Under reduced motion, or with no WebGL
 * context available, it renders nothing at all and the page is unaffected.
 */
export function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch {
      // No WebGL: the page is complete without this layer.
      return;
    }

    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, 1, 0.1, 300);
    camera.position.z = 42;

    const count = particleCount(window.innerWidth);
    const geometry = buildGeometry(count);

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDirection: { value: 1 },
        uSpeed: { value: 1.4 },
        uSpread: { value: SPREAD },
        uPixelRatio: { value: 1 },
        uColorIn: { value: new Color('#3987e5') },
        uColorOut: { value: new Color('#d95926') },
        uPhase: { value: 0 },
        uIntensity: { value: 0.2 },
      },
    });

    const points = new Points(geometry, material);
    scene.add(points);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      material.uniforms.uPixelRatio!.value = dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    let running = true;
    // Eased toward the store values so a fast scroll does not snap the field.
    let phase = 0;
    let intensity = 0;

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const { chapter, progress } = useScrollStore.getState();

      // Intro is quiet, the timeline fills, the reveal turns the flow around,
      // and the calculator hands the screen back to the controls.
      const targetPhase = chapter === 'gap' ? progress : chapter === 'intro' ? 0 : 0.08;
      const targetIntensity =
        chapter === 'intro'
          ? 0.55
          : chapter === 'timeline'
            ? 0.45 + progress * 0.55
            : chapter === 'gap'
              ? 1.0
              : 0.18;

      phase += (targetPhase - phase) * Math.min(1, dt * 2.5);
      intensity += (targetIntensity - intensity) * Math.min(1, dt * 2.5);

      const u = material.uniforms;
      u.uTime!.value += dt;
      u.uPhase!.value = phase;
      u.uIntensity!.value = intensity;
      // Above the halfway point of the reveal the money is owed back, so the
      // stream runs the other way.
      u.uDirection!.value = phase > 0.5 ? -1 : 1;
      u.uSpeed!.value = 1.1 + phase * 2.2;

      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(tick);
    };

    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
