/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.BASE_PATH || (process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : './'),
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex';
          }
          if (id.includes('node_modules/prismjs')) {
            return 'vendor-prism';
          }
          if (id.includes('node_modules/marked') || id.includes('node_modules/dompurify')) {
            return 'vendor-parser';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
})