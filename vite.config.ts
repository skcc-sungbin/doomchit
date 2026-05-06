import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repoBase = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base: repoBase,
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],
})
