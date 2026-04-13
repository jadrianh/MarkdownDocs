import { defineConfig } from 'vite';

export default defineConfig({
  base: '/MarkdownDocs/',
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js', 'tests/integration/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});