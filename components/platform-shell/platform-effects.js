// Shared, credential-free display preferences. No gameplay or scoring state lives here.
export const effectsModes = ['off', 'low', 'standard', 'high', 'auto'];
export const effectsLabels = {
  en: { title: 'Motion effects', off: 'Off', low: 'Low quality', standard: 'Standard quality', high: 'High quality', auto: 'Automatic' },
  th: { title: 'เอฟเฟกต์เคลื่อนไหว', off: 'ปิด', low: 'คุณภาพต่ำ', standard: 'คุณภาพมาตรฐาน', high: 'คุณภาพสูง', auto: 'อัตโนมัติ' },
  'zh-CN': { title: '动态效果', off: '关闭', low: '低质量', standard: '标准质量', high: '高质量', auto: '自动' },
  'zh-TW': { title: '動態效果', off: '關閉', low: '低品質', standard: '標準品質', high: '高品質', auto: '自動' },
  ru: { title: 'Анимация', off: 'Выключена', low: 'Низкое качество', standard: 'Стандартное качество', high: 'Высокое качество', auto: 'Автоматически' },
};
export function effectsCookieDomain(host = '') {
  if (host === 'staging.alienfarmers.org' || host.endsWith('.staging.alienfarmers.org')) return '.staging.alienfarmers.org';
  if (host === 'alienfarmers.org' || host.endsWith('.alienfarmers.org')) return '.alienfarmers.org';
  return '';
}
export function automaticEffects({ reduced = false, memory = 0, cores = 0, saveData = false } = {}) {
  if (reduced) return 'off';
  if (saveData || (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4)) return 'low';
  if (memory >= 8 && cores >= 8) return 'high';
  return 'standard';
}
export const initialEffects = Object.freeze({ mode: 'auto', quality: 'standard', enabled: true, ready: false });
export function createEffectsStore(env = globalThis) {
  const key = 'af_effects', listeners = new Set();
  let state = initialEffects, started = false, resume = 'auto', samples = 0, slow = 0, automaticCap = null;
  const readCookie = name => {
    try { return (env.document?.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(name + '='))?.slice(name.length + 1); } catch { return undefined; }
  };
  const readLocal = () => { try { return env.localStorage?.getItem(key); } catch { return undefined; } };
  const valid = value => effectsModes.includes(value);
  const detect = () => automaticEffects({ reduced: env.matchMedia?.('(prefers-reduced-motion: reduce)').matches, memory: env.navigator?.deviceMemory, cores: env.navigator?.hardwareConcurrency, saveData: env.navigator?.connection?.saveData });
  const writeCookie = mode => {
    const domain = effectsCookieDomain(env.location?.hostname);
    try { env.document.cookie = `${key}=${mode}; Path=/; Max-Age=31536000; SameSite=Lax${domain ? '; Domain=' + domain : ''}${env.location?.protocol === 'https:' ? '; Secure' : ''}`; } catch { /* Storage-blocked browsing still works in memory. */ }
  };
  function apply(mode) {
    const quality = mode === 'auto' ? (automaticCap || detect()) : mode;
    if (state.ready && state.mode === mode && state.quality === quality) return;
    state = Object.freeze({ mode, quality, enabled: quality !== 'off', ready: true });
    samples = slow = 0;
    if (env.document?.documentElement) {
      Object.assign(env.document.documentElement.dataset, { effectsMode: mode, effectsQuality: quality, motion: state.enabled ? 'on' : 'off' });
    }
    try { env.sessionStorage?.setItem('alien-farmers-motion-session', state.enabled ? 'on' : 'off'); } catch { /* Compatibility state is optional. */ }
    listeners.forEach(callback => callback(state));
  }
  function refresh() {
    const saved = readCookie(key) || readLocal();
    if (valid(saved)) apply(saved);
    else if (!state.ready) {
      let legacy; try { legacy = env.sessionStorage?.getItem('alien-farmers-motion-session'); } catch {}
      apply(legacy === 'off' ? 'off' : 'auto');
    } else apply(state.mode);
  }
  function start() {
    if (started || !env.document) return;
    started = true; refresh();
    env.addEventListener?.('focus', refresh);
    env.addEventListener?.('pageshow', refresh);
    env.addEventListener?.('storage', event => { if (event.key === key) refresh(); });
    env.document.addEventListener?.('visibilitychange', () => { if (!env.document.hidden) refresh(); });
    env.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', () => { automaticCap = null; apply(state.mode); });
  }
  function set(mode) {
    if (!valid(mode)) return false;
    start(); if (mode !== 'off') resume = mode;
    automaticCap = null;
    try { env.localStorage?.setItem(key, mode); } catch {}
    writeCookie(mode); apply(mode); return true;
  }
  return {
    start, get: () => state, set, refresh,
    lowerQuality() { if (state.mode === 'auto' && state.enabled && state.quality !== 'low') { automaticCap = state.quality === 'high' ? 'standard' : 'low'; apply('auto'); } },
    subscribe(callback) { listeners.add(callback); return () => listeners.delete(callback); },
    toggle() { start(); if (state.enabled) { resume = state.mode; set('off'); } else set(resume === 'auto' && detect() === 'off' ? 'standard' : resume); },
    // Called only by an actively rendering scene; never slows physics or input sampling.
    reportFrame(ms) {
      if (state.mode !== 'auto' || !state.enabled || env.document?.hidden || !Number.isFinite(ms) || ms <= 0 || ms > 250) return;
      samples++; if (ms > 24) slow++;
      if (samples < 180) return;
      const shouldLower = slow > 60; samples = slow = 0;
      if (shouldLower && state.quality !== 'low') { automaticCap = state.quality === 'high' ? 'standard' : 'low'; apply('auto'); }
    },
  };
}
export const effectsStore = createEffectsStore();
export function mountEffectsControl(container, locale = 'en') {
  const doc = container.ownerDocument, copy = effectsLabels[locale] || effectsLabels.en;
  const label = doc.createElement('label'), text = doc.createElement('span'), select = doc.createElement('select');
  label.className = 'af-platform-shell__effects'; text.textContent = copy.title; select.setAttribute('aria-label', copy.title);
  for (const mode of effectsModes) { const option = doc.createElement('option'); option.value = mode; select.append(option); }
  label.append(text, select); container.append(label);
  const sync = state => { select.value = state.mode; for (const option of select.options) option.textContent = copy[option.value] + (option.value === 'auto' && state.mode === 'auto' ? ` · ${copy[state.quality]}` : ''); };
  select.addEventListener('change', () => effectsStore.set(select.value));
  const stop = effectsStore.subscribe(sync); effectsStore.start(); sync(effectsStore.get());
  return () => { stop(); label.remove(); };
}
