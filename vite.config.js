import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk for React and related libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // UI libraries chunk
          if (id.includes('node_modules/motion') || id.includes('node_modules/swiper') || id.includes('node_modules/sweetalert2')) {
            return 'ui-vendor';
          }
          // Data fetching chunk
          if (id.includes('node_modules/@tanstack/react-query') || id.includes('node_modules/axios')) {
            return 'query-vendor';
          }
          // Charts chunk (lazy loaded)
          if (id.includes('node_modules/recharts')) {
            return 'charts-vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
})
