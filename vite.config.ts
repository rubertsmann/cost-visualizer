import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // No manual chunking: the scene is lazy-imported, so three lands in its
  // own chunk on its own and never enters the initial bundle.
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
