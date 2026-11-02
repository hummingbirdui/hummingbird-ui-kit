/**
 * classic-scripts — makes the production build open straight from disk (file://).
 *
 * Browsers block `<script type="module">` and `crossorigin` assets on file:// URLs, so a
 * double-clicked dist/index.html would load with no CSS or JS. Our entry chunks only run
 * side effects (no exports), so they can safely be loaded as ordered, deferred classic scripts.
 */
export default function classicScripts() {
  return {
    name: 'classic-scripts',
    apply: 'build',
    enforce: 'post',

    generateBundle(_, bundle) {
      const chunks = Object.values(bundle).filter((file) => file.type === 'chunk');

      for (const chunk of chunks) {
        // only bare side-effect imports (import"./x.js") are allowed; anything else needs real modules
        const imports = chunk.code.match(/\bimport\b[^;]*?["'][^"']+["']/g) ?? [];
        const bareImports = imports.every((statement) => /^import\s*["']/.test(statement));
        if (
          chunk.exports?.length ||
          chunk.dynamicImports?.length ||
          !bareImports ||
          chunk.code.includes('import.meta')
        ) {
          this.error(`${chunk.fileName} can't run as a classic script (it uses exports or import bindings).`);
        }
        // side-effect imports like import"../main.js"; are loaded by their own <script> tag instead
        // and each chunk gets its own scope, since classic scripts share one global scope
        const code = chunk.code.replace(/import\s*["'][^"']+["'];?/g, '');
        chunk.code = `(function(){'use strict';\n${code}\n})();\n`;
      }

      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.html')) continue;

        file.source = String(file.source)
          .replace(/<link rel="modulepreload"[^>]*>\n?/g, '')
          .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_, src) => {
            const chunk = chunks.find((c) => src.endsWith(c.fileName));
            const base = src.slice(0, src.length - chunk.fileName.length);
            const deps = chunk.imports.map((dep) => `<script defer src="${base}${dep}"></script>\n`).join('');
            return `${deps}<script defer src="${src}"></script>`;
          })
          .replace(/ crossorigin/g, '');
      }
    },
  };
}
