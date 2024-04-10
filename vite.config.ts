import react from '@vitejs/plugin-react'
// import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// import mkcert from 'vite-plugin-mkcert'
// import { VitePWA } from 'vite-plugin-pwa'
// import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tsconfigPaths({
    //   parseNative: false,
    // }),
    // mkcert(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    // }),
  ],
  // resolve: {
  //   alias: [
  //     {
  //       find: '@',
  //       replacement: fileURLToPath(new URL('./src', import.meta.url)),
  //     },
  //     {
  //       find: '@assets',
  //       replacement: fileURLToPath(new URL('./src/assets', import.meta.url)),
  //     },
  //     {
  //       find: '@styles',
  //       replacement: fileURLToPath(new URL('./src/styles', import.meta.url)),
  //     },
  //   ],
  // },
  // server: {
  //   host: true,
  //   port: 4380,
  // },
  // envDir: 'env',
  // envPrefix: ['VITE_'],
  base: '/storygen/',
})
