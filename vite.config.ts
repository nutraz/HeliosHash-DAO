import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const canisterIdsPath = join(fileURLToPath(new URL('.', import.meta.url)), '.dfx', 'local', 'canister_ids.json');
let canisterIds = {};
try {
  canisterIds = JSON.parse(readFileSync(canisterIdsPath, 'utf8'));
} catch (e) {
  console.log('Could not find canister_ids.json. Continuing without canister aliases.');
}

const canisterAliases = Object.entries(canisterIds).reduce((acc, [name, ids]) => {
  const { local: canisterId } = ids;
  if (canisterId) {
    return {
      ...acc,
      [`dfx-generated/${name}`]: join(
        fileURLToPath(new URL('.', import.meta.url)),
        'src',
        'declarations',
        name
      ),
    };
  }
  return acc;
}, {});


const DFX_PORT = 8000;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...canisterAliases,
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${DFX_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  define: {
    'process.env.CANISTER_IDS': JSON.stringify(canisterIds)
  }
});
