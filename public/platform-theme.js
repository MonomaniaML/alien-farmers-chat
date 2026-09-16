// Runs before paint. Shared cookie wins over legacy per-origin preferences.
(function () {
  const root = document.documentElement, key = 'alien-farmers-theme';
  const host = location.hostname;
  const domain = host === 'staging.alienfarmers.org' || host.endsWith('.staging.alienfarmers.org') ? 'staging.alienfarmers.org' : host === 'alienfarmers.org' || host.endsWith('.alienfarmers.org') ? 'alienfarmers.org' : '';
  const read = () => document.cookie.split(';').map(s => s.trim()).find(s => /^af_theme=(light|dark)$/.test(s))?.split('=')[1];
  let previous;
  function apply(value) {
    if (value !== 'light' && value !== 'dark') return;
    if (root.dataset.theme !== value) root.dataset.theme = value;
    root.classList.toggle('dark', value === 'dark');
    root.style.colorScheme = value;
    try { localStorage.setItem(key, value); localStorage.setItem('af-chat-theme', value); } catch {}
    if (previous === value) return;
    previous = value;
    document.cookie = 'af_theme=' + value + '; Path=/; Max-Age=31536000; SameSite=Lax' + (domain ? '; Domain=' + domain : '') + (location.protocol === 'https:' ? '; Secure' : '');
    window.dispatchEvent(new Event('alien-farmers-theme-change'));
  }
  let stored; try { stored = localStorage.getItem(key) || localStorage.getItem('af-chat-theme'); } catch {}
  apply(read() || stored || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  new MutationObserver(() => apply(root.dataset.theme)).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('focus', () => apply(read()));
  window.addEventListener('pageshow', () => apply(read()));
  window.addEventListener('storage', e => { if (e.key === key) apply(read() || e.newValue); });
})();
