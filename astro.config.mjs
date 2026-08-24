import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Vercel deployment uses default static export
  outDir: './dist',
});
