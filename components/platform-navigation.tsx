'use client';

import { useEffect, useRef, useState } from 'react';
import type { MemberProfile } from '@/lib/member-navigation';
import { platformOrigins } from '@/lib/platform-environment';
import { useI18n, type Locale } from '@/lib/support/i18n';
import { BrandMark } from '@/components/brand-mark';
import { MemberProfileNavigation } from '@/components/member-profile-navigation';
import { PlatformIcon } from '@/components/platform-icon';

type RouteKey = 'home' | 'archive' | 'verify' | 'member' | 'drop' | 'social' | 'support';

const routes: ReadonlyArray<[RouteKey, string]> = [
  ['home', platformOrigins.website],
  ['archive', `${platformOrigins.website}/flowers`],
  ['verify', platformOrigins.verify],
  ['member', platformOrigins.member],
  ['drop', platformOrigins.drop],
  ['social', platformOrigins.social],
  ['support', platformOrigins.support],
];

const labels: Record<Locale, Record<RouteKey | 'theme' | 'soon' | 'close' | 'light' | 'dark', string>> = {
  en: { home: 'Home', archive: 'Product archive', verify: 'Product verification', member: 'Member center', drop: 'Drop rewards', social: 'Community / Forum', support: 'Customer support', theme: 'Appearance', soon: 'SOON', close: 'Close menu', light: 'Light mode', dark: 'Dark mode' },
  th: { home: 'หน้าหลัก', archive: 'คลังข้อมูลสินค้า', verify: 'ตรวจสอบสินค้า', member: 'ศูนย์สมาชิก', drop: 'รางวัลดรอป', social: 'ชุมชน / ฟอรัม', support: 'ฝ่ายช่วยเหลือ', theme: 'ธีม', soon: 'เร็ว ๆ นี้', close: 'ปิดเมนู', light: 'โหมดสว่าง', dark: 'โหมดมืด' },
  'zh-CN': { home: '首页', archive: '产品档案', verify: '产品验证', member: '会员中心', drop: '掉落奖励', social: '社区 / 论坛', support: '客服支持', theme: '明暗模式', soon: '即将开放', close: '关闭菜单', light: '亮色模式', dark: '暗色模式' },
  'zh-TW': { home: '首頁', archive: '產品檔案', verify: '產品驗證', member: '會員中心', drop: '掉落獎勵', social: '社群 / 論壇', support: '客服支援', theme: '明暗模式', soon: '即將開放', close: '關閉選單', light: '亮色模式', dark: '暗色模式' },
  ru: { home: 'Главная', archive: 'Архив продуктов', verify: 'Проверка продукта', member: 'Центр участника', drop: 'Награды Drop', social: 'Сообщество / Форум', support: 'Поддержка', theme: 'Тема', soon: 'СКОРО', close: 'Закрыть меню', light: 'Светлая тема', dark: 'Тёмная тема' },
};

const localeNames: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  th: { short: 'TH', name: 'ไทย' },
  'zh-CN': { short: '简', name: '简体中文' },
  'zh-TW': { short: '繁', name: '繁體中文' },
  ru: { short: 'RU', name: 'Русский' },
};

function NavIcon({ kind }: { kind: RouteKey }) {
  if (kind === 'home') return <svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /></svg>;
  if (kind === 'archive') return <svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7zM15 3v5h4M10 12h6M10 16h6" /></svg>;
  if (kind === 'verify') return <svg viewBox="0 0 24 24"><path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4m-11-5 2 2 4-5" /></svg>;
  if (kind === 'member') return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-5 3-7 8-7s7.5 2 8 7" /></svg>;
  if (kind === 'drop') return <svg viewBox="0 0 24 24"><path d="M5 7h14v14H5zM9 7V4h6v3m-6 5h6m-3-3v6" /></svg>;
  if (kind === 'social') return <svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 20c.5-4 2.5-6 6-6s5.5 2 6 6m-1-5c1-.8 2-1 3-1 3.5 0 5.5 2 6 6" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M5 13v-2a7 7 0 0 1 14 0v2M5 12H3v6h4v-6m12 0h2v6h-4v-6m0 7c-1 1.3-2.6 2-5 2" /></svg>;
}

function LanguageMenu() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    window.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); window.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="platform-global-language" ref={root}>
    <button type="button" aria-label="Language" aria-expanded={open} onClick={() => setOpen(current => !current)}><span>{localeNames[locale].short}</span><i /></button>
    {open ? <div role="menu">{(Object.keys(localeNames) as Locale[]).map(key => <button className={key === locale ? 'active' : ''} type="button" role="menuitem" key={key} onClick={() => { setLocale(key); setOpen(false); }}><b>{localeNames[key].short}</b><span>{localeNames[key].name}</span></button>)}</div> : null}
  </div>;
}

function ThemeButton({ theme, toggle, label }: { theme: 'dark' | 'light'; toggle: () => void; label: string }) {
  return <button className="platform-global-theme" type="button" onClick={toggle} aria-label={label} title={label}><span data-mode={theme} /></button>;
}

export function PlatformNavigation({ theme, toggleTheme, unreadMessageCount, onSessionChange }: { theme: 'dark' | 'light'; toggleTheme: () => void; unreadMessageCount: number; onSessionChange: (profile: MemberProfile | null) => void }) {
  const { locale } = useI18n();
  const copy = labels[locale];
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setDrawerOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [drawerOpen]);

  return <>
    <header className="platform-global-header">
      <div className="platform-global-main">
        <button className={`platform-global-menu${drawerOpen ? ' open' : ''}`} type="button" onClick={() => setDrawerOpen(current => !current)} aria-expanded={drawerOpen} aria-label="Menu"><i /><i /><i /></button>
        <div className="platform-global-brand"><BrandMark /><a href={platformOrigins.website}><strong>ALIEN FARMERS</strong></a></div>
        <div className="platform-global-actions">
          <ThemeButton theme={theme} toggle={toggleTheme} label={copy[theme === 'dark' ? 'light' : 'dark']} />
          <LanguageMenu />
          <MemberProfileNavigation locale={locale} unreadMessageCount={unreadMessageCount} onSessionChange={onSessionChange} theme={theme} />
        </div>
      </div>
      <nav className="platform-global-shortcuts" aria-label="Quick access">{routes.slice(1).map(([key, href]) => <a className={key === 'support' ? 'active' : ''} href={href} key={key}><NavIcon kind={key} /><span>{copy[key]}</span>{key === 'drop' || key === 'social' ? <small>{copy.soon}</small> : null}</a>)}</nav>
    </header>
    <aside className={`platform-global-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="platform-global-drawer-head"><div className="platform-global-brand"><BrandMark interactive={false} /><a href={platformOrigins.website}><strong>ALIEN FARMERS</strong></a></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label={copy.close}>×</button></div>
      <nav>{routes.map(([key, href]) => <a className={key === 'support' ? 'active' : ''} href={href} key={key}><PlatformIcon type={key} /><span>{copy[key]}</span>{key === 'drop' || key === 'social' ? <small>{copy.soon}</small> : null}</a>)}</nav>
      <div className="platform-global-drawer-theme"><span>{copy.theme}</span><ThemeButton theme={theme} toggle={toggleTheme} label={copy[theme === 'dark' ? 'light' : 'dark']} /></div>
    </aside>
    {drawerOpen ? <button className="platform-global-scrim" type="button" onPointerDown={() => setDrawerOpen(false)} onClick={() => setDrawerOpen(false)} aria-label={copy.close} /> : null}
    <nav className="platform-global-mobile" aria-label="Primary navigation">{(['home', 'archive', 'verify', 'member'] as RouteKey[]).map(key => { const href = routes.find(([route]) => route === key)?.[1] || platformOrigins.website; return <a href={href} key={key}><NavIcon kind={key} /><span>{copy[key]}</span></a>; })}</nav>
  </>;
}
