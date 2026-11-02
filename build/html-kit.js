/**
 * html-kit — a tiny Vite plugin that renders every HTML page through Handlebars.
 *
 * - Partials:  src/partials/*.hbs        → {{> navbar}}, {{#> layout}}...{{/layout}}
 * - Data:      src/data/site.json        → available as {{@root.site}}
 * - {{root}}:  relative path from the current page to the project root (for links)
 * - {{#example class="..."}}...{{/example}} renders a live preview + highlighted, copyable source
 * - {{#code lang="css"}}...{{/code}} renders a highlighted, copyable code block
 * - <!-- toc --> is replaced with links to every <section data-toc="Title" id="..."> on the page
 */
import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { createHighlighter } from 'shiki';
import { transformerStyleToClass } from '@shikijs/transformers';

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function dedent(str) {
  const lines = str
    .replace(/^\s*\n/, '')
    .replace(/\s+$/, '')
    .split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

export default function htmlKit() {
  let root = process.cwd();
  let highlighter;
  // token colors become shared classes instead of inline styles (keeps pages small)
  const toClass = transformerStyleToClass({ classPrefix: 'sk-' });

  const partialsDir = () => path.join(root, 'src/partials');
  const dataFile = () => path.join(root, 'src/data/site.json');

  function createEngine() {
    const hb = Handlebars.create();

    // nested partials are registered by path, e.g. {{> illustrations/forms}}
    for (const file of fs.readdirSync(partialsDir(), { recursive: true })) {
      if (file.endsWith('.hbs')) {
        const name = file.slice(0, -'.hbs'.length).split(path.sep).join('/');
        hb.registerPartial(name, fs.readFileSync(path.join(partialsDir(), file), 'utf8'));
      }
    }

    const site = JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
    const flatNav = site.nav.flatMap((group) => group.items);
    let exampleId = 0;

    hb.registerHelper('eq', (a, b) => a === b);
    hb.registerHelper('concat', (...args) => args.slice(0, -1).join(''));
    hb.registerHelper('prevPage', (page) => flatNav[flatNav.findIndex((i) => i.page === page) - 1]);
    hb.registerHelper('nextPage', (page) => flatNav[flatNav.findIndex((i) => i.page === page) + 1]);
    hb.registerHelper('navItem', (page) => flatNav.find((i) => i.page === page));

    hb.registerHelper('example', function (options) {
      const code = dedent(options.fn(this));
      const id = `example-code-${++exampleId}`;
      const highlighted = highlighter.codeToHtml(code, {
        lang: 'html',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
        transformers: [toClass],
      });
      return new hb.SafeString(`<div class="kit-example">
  <div class="kit-example-preview ${escapeAttr(options.hash.class ?? '')}">
${code}
  </div>
  <div class="kit-example-actions">
    <button type="button" class="btn btn-text-neutral btn-sm" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}" data-code-toggle>Show code</button>
    <button type="button" class="btn btn-text-neutral btn-sm" data-copy-code="${id}">Copy</button>
  </div>
  <div class="collapse" id="${id}"><div class="kit-code">${highlighted}</div></div>
</div>`);
    });

    // {{#code lang="css"}}...{{/code}} renders a highlighted, copyable code block (no preview)
    hb.registerHelper('code', function (options) {
      const code = dedent(options.fn(this));
      const id = `code-${++exampleId}`;
      const highlighted = highlighter.codeToHtml(code, {
        lang: options.hash.lang ?? 'html',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
        transformers: [toClass],
      });
      return new hb.SafeString(`<div class="kit-code kit-code-standalone" id="${id}">
  <button type="button" class="btn btn-text-neutral btn-sm kit-code-copy" data-copy-code="${id}">Copy</button>
  ${highlighted}
</div>`);
    });

    return { hb, site };
  }

  function buildToc(html) {
    const entries = [...html.matchAll(/<section[^>]*\sid="([^"]+)"[^>]*\sdata-toc="([^"]+)"/g)];
    if (!entries.length) return html.replace('<!-- toc -->', '');
    const links = entries
      .map(([, id, title]) => `<li><a class="kit-toc-link" href="#${id}">${title}</a></li>`)
      .join('\n');
    return html.replace('<!-- toc -->', `<ul class="kit-toc">${links}</ul>`);
  }

  return {
    name: 'html-kit',

    async configResolved(config) {
      root = config.root;
      highlighter = await createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['html', 'bash', 'css'],
      });
    },

    configureServer(server) {
      server.watcher.add([partialsDir(), dataFile()]);
      server.watcher.on('change', (file) => {
        if (file.startsWith(partialsDir()) || file === dataFile()) server.ws.send({ type: 'full-reload' });
      });
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const { hb, site } = createEngine();
        const relDir = path.dirname(path.relative(root, ctx.filename));
        const rootPath =
          relDir === '.'
            ? ''
            : relDir
                .split(path.sep)
                .map(() => '..')
                .join('/') + '/';
        const rendered = buildToc(hb.compile(html, { preventIndent: true })({ site, root: rootPath }));
        return rendered.replace('</head>', `<style>${toClass.getCSS()}</style>\n</head>`);
      },
    },
  };
}
