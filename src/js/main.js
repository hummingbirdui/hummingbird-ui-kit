// importing Hummingbird also wires up every data-bs-* component on the page
import { Toast, Tooltip } from '@hummingbirdui/hummingbird';

/* ---------- Light / dark mode ---------- */

const THEME_KEY = 'theme';
const THEMES = { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' };

const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT);
const getStoredTheme = () => localStorage.getItem(THEME_KEY) ?? THEMES.SYSTEM;
const resolveTheme = (theme) => (theme === THEMES.SYSTEM ? getSystemTheme() : theme);

const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.add('disable-transition');
  html.classList.toggle('dark', resolveTheme(theme) === THEMES.DARK);
  requestAnimationFrame(() => html.classList.remove('disable-transition'));
};

const toggleTheme = () => {
  const next = resolveTheme(getStoredTheme()) === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
};

const initThemeToggle = () => {
  applyTheme(getStoredTheme());

  // follow the OS preference while the user hasn't picked a mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === THEMES.SYSTEM) applyTheme(THEMES.SYSTEM);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-theme-toggle-btn]')) toggleTheme();
  });
};

/* ---------- Example code: show / copy ---------- */

const copyText = async (text, button) => {
  await navigator.clipboard.writeText(text);

  // buttons with a tooltip (color swatches) confirm through the tooltip, others swap their label
  const tooltip = Tooltip.getInstance(button);
  if (tooltip) {
    const title = button.dataset.bsTitle;
    tooltip.setContent({ '.tooltip-inner': 'Copied!' });
    setTimeout(() => tooltip.setContent({ '.tooltip-inner': title }), 1500);
    return;
  }
  const label = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => (button.textContent = label), 1500);
};

const initCodeActions = () => {
  document.querySelectorAll('[data-code-toggle]').forEach((button) => {
    const target = document.querySelector(button.dataset.bsTarget);
    target.addEventListener('show.bs.collapse', () => (button.textContent = 'Hide code'));
    target.addEventListener('hide.bs.collapse', () => (button.textContent = 'Show code'));
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-copy-code], [data-copy-text]');
    if (!button) return;
    const text =
      button.dataset.copyText ?? document.getElementById(button.dataset.copyCode).querySelector('pre').textContent;
    copyText(text, button);
  });
};

/* ---------- "On this page" active link ---------- */

const initToc = () => {
  const links = [...document.querySelectorAll('.kit-toc-link')];
  if (!links.length) return;
  const sections = links.map((link) => document.querySelector(link.getAttribute('href')));

  const update = () => {
    const offset = 140;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top - offset <= 0) active = section;
    }
    links.forEach((link) => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${active.id}`)));
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
};

/* ---------- Showcase demos ---------- */

const initDemos = () => {
  // live toast
  const toastTrigger = document.getElementById('liveToastBtn');
  const liveToast = document.getElementById('liveToast');
  if (toastTrigger && liveToast) {
    toastTrigger.addEventListener('click', () => Toast.getOrCreateInstance(liveToast).show());
  }

  // toast placement picker
  const toastPlacement = document.getElementById('toastPlacement');
  const toastPlacementSelect = document.getElementById('selectToastPlacement');
  if (toastPlacement && toastPlacementSelect) {
    const originalClass = toastPlacement.className;
    toastPlacementSelect.addEventListener('change', () => {
      toastPlacement.className = `${originalClass} ${toastPlacementSelect.value}`;
    });
  }

  // bootstrap-style form validation
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // demo links shouldn't jump to the top of the page
  document.addEventListener('click', (event) => {
    if (event.target.closest('.kit-example-preview a[href="#"]')) event.preventDefault();
  });
};

initThemeToggle();
initCodeActions();
initToc();
initDemos();
