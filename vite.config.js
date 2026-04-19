import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/shared/ui'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@contexts': path.resolve(__dirname, 'src/app/contexts'),
      '@constants': path.resolve(__dirname, 'src/shared/constants'),
    },
  },
    server: {  
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://docbuilder-application.up.railway.app',
        changeOrigin: true,
        secure: false, 
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.headers['set-cookie']) {
              const originalCookies = proxyRes.headers['set-cookie'];
              console.log('[Proxy] Original cookies:', originalCookies);
              
              const modifiedCookies = originalCookies.map(cookie => {
                let modified = cookie
                  .replace(/; Secure/gi, '')
                  .replace(/; secure/gi, '');
                
                modified = modified.replace(/; SameSite=None/gi, '; SameSite=Lax');
                
                return modified;
              });
              
              proxyRes.headers['set-cookie'] = modifiedCookies;
              console.log('[Proxy] Modified cookies:', modifiedCookies);
            }
          });
        }
      }
    }
  }

})