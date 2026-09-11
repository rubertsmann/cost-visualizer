import { create } from 'zustand';

export type ChapterId = 'intro' | 'timeline' | 'gap' | 'calculator' | 'outro';

interface ScrollState {
  chapter: ChapterId;
  /** Progress through the current chapter, 0..1. */
  progress: number;
  /** Progress through the whole document, 0..1. */
  documentProgress: number;
  setChapter: (chapter: ChapterId) => void;
  setProgress: (progress: number) => void;
  setDocumentProgress: (documentProgress: number) => void;
}

/**
 * Written by GSAP ScrollTrigger callbacks, read two ways: by React for
 * anything that should re-render, and by the WebGL loop via getState()
 * inside its own rAF, so scroll never costs a React render.
 */
export const useScrollStore = create<ScrollState>((set) => ({
  chapter: 'intro',
  progress: 0,
  documentProgress: 0,
  setChapter: (chapter) => set({ chapter }),
  setProgress: (progress) => set({ progress }),
  setDocumentProgress: (documentProgress) => set({ documentProgress }),
}));
