import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import htmlKit from './build/html-kit.js';

const root = import.meta.dirname;

// index.html + every .html file inside /pages is an entry
const pages = ['index.html', ...readdirSync(resolve(root, 'pages'), { recursive: true }).map((f) => `pages/${f}`)];
const input = Object.fromEntries(
  pages.filter((f) => f.endsWith('.html')).map((f) => [f.replace(/\.html$/, ''), resolve(root, f)]),
);

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), htmlKit()],
  build: {
    rollupOptions: { input },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
