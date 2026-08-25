import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Alvo moderno: elimina polyfills desnecessários e reduz bundle
    target: 'es2020',
    cssCodeSplit: true,
    // Reduz tamanho do CSS inlined no JS
    cssMinify: true,
    rollupOptions: {
      output: {
        // Mantém assets com hash para cache-busting confiável
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        manualChunks(id) {
          // React e ReactDOM em chunk separado (muda menos)
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Supabase em chunk separado (carregado só quando necessário)
          if (id.includes('@supabase')) {
            return 'supabase-vendor'
          }
        },
      },
    },
  },
})
