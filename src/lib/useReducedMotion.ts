import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
const STORAGE_KEY = 'cost-visualizer:motion';

export type MotionPreference = 'system' | 'reduced' | 'full';

/**
 * Motion is a user setting, not just an OS one. A page this heavy on scroll
 * effects should let someone turn them off where they are reading it, and
 * the OS setting stays the default for anyone who has already expressed one.
 */
let preference: MotionPreference = read();
const listeners = new Set<() => void>();

function read(): MotionPreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'reduced' || v === 'full' || v === 'system') return v;
  } catch {
    // Private mode or blocked storage: the system setting still works.
  }
  return 'system';
}

function emit() {
  for (const l of listeners) l();
}

export function setMotionPreference(next: MotionPreference): void {
  preference = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not persisting is survivable; the choice still holds for this visit.
  }
  emit();
}

export function getMotionPreference(): MotionPreference {
  return preference;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const mq = matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener('change', onChange);
  };
}

function systemPrefersReduced(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia(QUERY).matches;
}

function snapshot(): boolean {
  if (preference === 'reduced') return true;
  if (preference === 'full') return false;
  return systemPrefersReduced();
}

/**
 * Reduced motion is not a degraded mode here — the page must read completely
 * as a static document, with the same numbers and the same argument, just
 * without the scrubbing and the particle field.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

export function useMotionPreference(): MotionPreference {
  return useSyncExternalStore(subscribe, getMotionPreference, () => 'system');
}
