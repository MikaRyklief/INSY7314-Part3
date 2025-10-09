import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const certDirectory = path.resolve(__dirname, '..', 'backend', 'certs');
const keyPath = path.join(certDirectory, 'server.key');
const certPath = path.join(certDirectory, 'server.crt');

const buildHttpsConfig = () => {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  }
  return undefined;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      https: buildHttpsConfig(),
      host: env.VITE_HOST || '0.0.0.0',
      port: Number(env.VITE_PORT || 5173),
      strictPort: true
    },
    preview: {
      https: buildHttpsConfig(),
      port: Number(env.VITE_PREVIEW_PORT || 4173)
    },
    build: {
      sourcemap: false
    }
  };
});
