import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = '/the-story-within/';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? repoBase : '/',
  plugins: [react()],
}));
