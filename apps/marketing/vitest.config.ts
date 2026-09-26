import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    exclude: ['./e2e/**', './node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './lib'),
      // Mirror the tsconfig path so workspace imports resolve in tests.
      '@forhemit/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@forhemit/shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
      '@forhemit/shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
    },
  },
})
