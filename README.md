# Hummingbird UI Kit

A free, open-source UI kit built with [Hummingbird](https://hbui.dev) and [Tailwind CSS](https://tailwindcss.com). It covers colors, themes, typography and 50 components, all in plain HTML and powered by Vite.

Every example has a live preview with **Show code** and **Copy** buttons, so you can paste the markup straight into your project.

## Features

- **Foundations:** semantic colors, the full color palette, light and dark mode, eight prebuilt themes, and typography.
- **50 components in 7 groups:**
  - Basic
  - Navigation
  - Overlays
  - Feedback & Data
  - Content & Layout
  - Forms
  - Advanced Forms
- **Light and dark mode** with a toggle that follows the system preference and remembers the user's choice.
- **Copyable code** for every example, with syntax highlighting.
- **Plain HTML output:** `npm run build` exports static files that work on any host, even from a subfolder.
- **Advanced form plugins** already set up: [Choices.js](https://github.com/Choices-js/Choices), [flatpickr](https://flatpickr.js.org), [noUiSlider](https://refreshless.com/nouislider/) and [Dropzone](https://www.dropzone.dev).

## Quick start

Requires **Node.js 20.19+**.

```bash
npm install
npm run dev       # http://localhost:3000
```

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server with live reload       |
| `npm run build`   | Build static HTML, CSS and JS into `dist/`  |
| `npm run preview` | Serve the production build locally          |
| `npm run format`  | Format the JS, CSS, JSON and Markdown files |

## Folder structure

```
hummingbird-ui-kit/
├── index.html                 # Overview page
├── pages/
│   ├── colors.html
│   ├── themes.html
│   ├── typography.html
│   └── components/            # One page per component group
├── src/
│   ├── partials/              # Shared layout: navbar, sidebar, footer, icons…
│   ├── data/site.json         # Site name, links, navigation, theme list
│   ├── css/style.css          # Tailwind + Hummingbird + kit styles
│   ├── js/main.js             # Hummingbird JS, dark mode, code copy, "On this page"
│   ├── js/advanced-forms.js   # Choices.js, flatpickr, noUiSlider, Dropzone setup
│   └── assets/images/
├── public/                    # Copied as-is (favicon, example images)
├── build/html-kit.js          # Small Vite plugin: Handlebars partials + code blocks
└── vite.config.js
```

## How pages are built

Pages are plain HTML with a few [Handlebars](https://handlebarsjs.com) tags. Vite renders them at build time, so `dist/` contains only static HTML.

```hbs
{{#> layout page="basic" title="Basic" description="…"}}
  <section id="buttons" data-toc="Buttons">
    {{> section-header title="Buttons" docs="components/buttons"}}

    {{#example class="text-center"}}
      <button class="btn btn-primary">Primary</button>
    {{/example}}
  </section>
{{/layout}}
```

| Tag                                 | What it does                                                        |
| ----------------------------------- | ------------------------------------------------------------------- |
| `{{#> layout}}`                     | Wraps a page in the navbar, sidebar, "On this page" list and footer |
| `<section id="…" data-toc="Title">` | Adds the section to the "On this page" list                         |
| `{{#example}}…{{/example}}`         | Shows a live preview with highlighted, copyable source              |
| `{{#code lang="css"}}…{{/code}}`    | Shows a highlighted, copyable code block without a preview          |

To add a page:

1. Create the HTML file in `pages/`.
2. Add it to `nav` in `src/data/site.json`.

Vite picks up every `.html` file automatically.

## Customizing

- **Theme:** import a prebuilt theme or override tokens in `src/css/style.css`. See [Theming](https://hbui.dev/docs/customize/theming).
- **Font:** change `--font-sans` in `src/css/style.css` and the Google Fonts link in `src/partials/head.hbs`.
- **Links and name:** edit `src/data/site.json`.

## Credits

- [Hummingbird](https://hbui.dev): component system for Tailwind CSS
- [Tailwind CSS](https://tailwindcss.com), [Vite](https://vite.dev), [Handlebars](https://handlebarsjs.com), [Shiki](https://shiki.style)
- Crafted by [ThemeWagon](https://themewagon.com)

## License

Released under the [MIT License](LICENSE).
