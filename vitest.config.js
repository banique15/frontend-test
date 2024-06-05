// vitest.config.js or vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Adjust './src' as necessary
    },
  },
  test: {
    // Test-specific configurations
  },
});
