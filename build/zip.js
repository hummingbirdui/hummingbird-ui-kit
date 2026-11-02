/**
 * Creates the downloadable package: release/hummingbird-ui-kit-v<version>.zip
 *
 *   hummingbird-ui-kit/
 *   ├── dist/        ready-to-use static HTML (open dist/index.html, no install needed)
 *   └── ...          full source to customize and rebuild (pnpm install && pnpm dev)
 *
 * Source files come from git (tracked + untracked, minus .gitignore'd), so node_modules,
 * local junk and secrets never end up in the zip. Run `pnpm build` first (`pnpm zip` does).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ZipArchive } from 'archiver';

const root = path.resolve(import.meta.dirname, '..');
const { name, version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

// repo-only files that are of no use to someone downloading the kit
const EXCLUDE = [/^\.github\//];

const distDir = path.join(root, 'dist');
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/ is missing. Run `pnpm build` first (or use `pnpm zip`).');
  process.exit(1);
}

const sourceFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
  cwd: root,
  encoding: 'utf8',
})
  .split('\0')
  .filter((file) => file && fs.existsSync(path.join(root, file)) && !EXCLUDE.some((re) => re.test(file)));

const outDir = path.join(root, 'release');
const outFile = path.join(outDir, `${name}-v${version}.zip`);
fs.mkdirSync(outDir, { recursive: true });

const output = fs.createWriteStream(outFile);
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  const mb = (archive.pointer() / 1024 / 1024).toFixed(1);
  console.log(`✓ ${path.relative(root, outFile)} (${sourceFiles.length} source files + dist/, ${mb} MB)`);
});
archive.on('warning', (err) => console.warn(err));
archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
for (const file of sourceFiles) archive.file(path.join(root, file), { name: `${name}/${file}` });
archive.directory(distDir, `${name}/dist`);
await archive.finalize();
