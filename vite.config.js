import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log("Loaded Environment Variables:", env);

  return {
    plugins: [react()],
    define: {
      'process.env': env
    }
  };
});
