import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

export default defineConfig(() => {
  const isVercelBuild = process.env.VERCEL === '1' || process.env.NITRO_PRESET === 'vercel';
  return {
    server: {
      host: '127.0.0.1', port: 5173, strictPort: true,
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
      proxy: { '/preview-api': { target: 'http://127.0.0.1:4318', changeOrigin: false } },
    },
    plugins: [
      tailwindcss(),
      vinext(),
      ...(isVercelBuild ? [nitro()] : []),
    ],
  };
});
