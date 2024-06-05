import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import node from '@astrojs/node';
import react from '@astrojs/react';
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: 'https://frontend-xi-self-50.vercel.app/',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    alpinejs(),
    react({ include: ['**/react/*'] }),
    svelte()
  ],
  middleware: ['./src/middleware.ts'],
});
