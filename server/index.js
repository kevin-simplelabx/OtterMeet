import express from 'express';
import path from 'node:path';
import { api } from './routes.js';

const app = express();
if (process.argv.includes('--prod')) process.env.NODE_ENV = 'production';
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 5173;

app.use(express.json({ limit: '100kb' }));
app.use('/api', api);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

if (isProd) {
  app.use(express.static('dist'));
  app.use((_req, res) => res.sendFile(path.resolve('dist/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, () => console.log(`OtterMeet running at http://localhost:${port}`));
