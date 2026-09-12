'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { ageVerificationCookie, ageVerificationStorageKey } from '@/lib/age-verification';
import type { Locale } from '@/lib/support/i18n';

const copy = {
  en: { eyebrow: 'AGE CONFIRMATION', title: 'Welcome to ALIEN FARMERS', description: 'You must be at least 20 years old to enter this website.', enter: 'I am 20 or older', leave: 'Leave website', remember: 'Remember my choice for one year' },
  th: { eyebrow: 'การยืนยันอายุ', title: 'ยินดีต้อนรับสู่ ALIEN FARMERS', description: 'คุณต้องมีอายุอย่างน้อย 20 ปีเพื่อเข้าสู่เว็บไซต์นี้', enter: 'ฉันมีอายุ 20 ปีขึ้นไป', leave: 'ออกจากเว็บไซต์', remember: 'จดจำตัวเลือกของฉันเป็นเวลาหนึ่งปี' },
  'zh-CN': { eyebrow: '年龄确认', title: '欢迎进入 ALIEN FARMERS', description: '你必须年满 20 岁才能进入本网站。', enter: '我已年满 20 岁', leave: '离开网站', remember: '记住我的选择一年' },
  'zh-TW': { eyebrow: '年齡確認', title: '歡迎進入 ALIEN FARMERS', description: '你必須年滿 20 歲才能進入本網站。', enter: '我已年滿 20 歲', leave: '離開網站', remember: '記住我的選擇一年' },
  ru: { eyebrow: 'ПОДТВЕРЖДЕНИЕ ВОЗРАСТА', title: 'Добро пожаловать в ALIEN FARMERS', description: 'Для входа на сайт вам должно быть не менее 20 лет.', enter: 'Мне уже исполнилось 20', leave: 'Покинуть сайт', remember: 'Запомнить мой выбор на год' },
} satisfies Record<Locale, Record<string, string>>;

function browserLocale(): Locale { const value = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase(); return value.startsWith('th') ? 'th' : value.startsWith('zh') ? value.includes('tw') || value.includes('hk') || value.includes('mo') ? 'zh-TW' : 'zh-CN' : value.startsWith('ru') ? 'ru' : 'en'; }
function ageCookie(remember: boolean) { const official = location.hostname === 'alienfarmers.org' || location.hostname.endsWith('.alienfarmers.org'); return `${ageVerificationCookie}=yes; Path=/${official ? '; Domain=.alienfarmers.org' : ''}${remember ? '; Max-Age=31536000' : ''}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; }

export function AgeGate({ initiallyVerified, bypass, children }: { initiallyVerified: boolean; bypass?: boolean; children: ReactNode }) {
  const [verified, setVerified] = useState(initiallyVerified || Boolean(bypass));
  const [remember, setRemember] = useState(false);
  const [locale, setLocale] = useState<Locale>('en');
  useEffect(() => {
    setLocale(browserLocale());
    if (bypass || verified) return;
    try {
      const persistent = localStorage.getItem(ageVerificationStorageKey) === 'yes';
      const session = sessionStorage.getItem(ageVerificationStorageKey) === 'yes';
      if (persistent || session) { document.cookie = ageCookie(persistent); queueMicrotask(() => setVerified(true)); }
    } catch { /* Cookie confirmation remains available. */ }
  }, [bypass, verified]);
  if (verified || bypass) return children;
  const words = copy[locale];
  const accept = () => { try { if (remember) localStorage.setItem(ageVerificationStorageKey, 'yes'); else sessionStorage.setItem(ageVerificationStorageKey, 'yes'); } catch {} document.cookie = ageCookie(remember); setVerified(true); };
  return <main className="chat-age-gate" role="dialog" aria-modal="true" aria-labelledby="chat-age-title"><section><BrandMark interactive={false}/><small>{words.eyebrow}</small><h1 id="chat-age-title">{words.title}</h1><p>{words.description}</p><label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)}/><i aria-hidden="true"/>{words.remember}</label><div><button type="button" onClick={accept}>{words.enter}<span>→</span></button><button type="button" onClick={() => location.replace('about:blank')}>{words.leave}</button></div></section></main>;
}
