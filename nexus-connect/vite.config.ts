import topLevelAwait from 'vite-plugin-top-level-await';
import oxlintPlugin from 'vite-plugin-oxlint';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    oxlintPlugin({ path: 'src' }),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    UnoCSS(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],

  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
