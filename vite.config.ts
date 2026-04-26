import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Local-dev middleware that mounts the same /api/concierge handler used by the
// production serverless function. The Gemini API key stays on the Node side
// and is never exposed to the browser bundle.
function conciergeDevApi(): Plugin {
  return {
    name: 'concierge-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/concierge', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Allow', 'POST');
          res.end('Method Not Allowed');
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString('utf8');
          const body = raw ? JSON.parse(raw) : {};
          const mod = await server.ssrLoadModule('/api/concierge.ts');
          const handle = (mod as typeof import('./api/concierge')).handleConcierge;
          const { status, data } = await handle(body);
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (err) {
          console.error('[concierge-dev-api] error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Make GEMINI_API_KEY available to the dev middleware via process.env without
  // ever inlining it into the client bundle.
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [tailwindcss(), react(), conciergeDevApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
