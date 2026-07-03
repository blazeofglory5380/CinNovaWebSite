import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Windows can throw EBUSY when native watchers lock large public image files.
      ignored: ['**/public/images/**'],
      usePolling: true,
      interval: 1000,
    },
  },
})
