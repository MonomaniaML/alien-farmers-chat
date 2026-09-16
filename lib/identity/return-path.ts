export function safeReturnTo(value: string) {
  if (!value.startsWith('/') || value.startsWith('//') || value.length > 2048 || /[\\\u0000-\u0020]/u.test(value)) return '/';
  try { const url = new URL(value, 'https://chat.invalid'); return url.origin === 'https://chat.invalid' ? url.pathname + url.search + url.hash : '/'; } catch { return '/'; }
}

export function ticketSessionSync(current: string) {
  const url = new URL(current);
  if (url.pathname !== '/tickets' || url.searchParams.has('af_session_sync')) return null;
  url.searchParams.set('af_session_sync', '1');
  return '/auth/login?' + new URLSearchParams({ prompt: 'none', returnTo: url.pathname + url.search + url.hash });
}
