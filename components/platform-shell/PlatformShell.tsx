"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { EffectsControl } from "./EffectsControl";

export const PLATFORM_SHELL_VERSION = "0.2.1";

export type PlatformRouteKey = "home" | "archive" | "verify" | "member" | "drop" | "social" | "support";
export type PlatformLocale = "en" | "th" | "zh-CN" | "zh-TW" | "ru";
export type PlatformAccountIconKind = "messages" | "notifications";
export type PlatformOrigins = { website: string; verify: string; member: string; drop: string; social: string; support: string };

export function withPlatformLocale(href: string, locale: PlatformLocale) {
  const url = new URL(href);
  url.searchParams.set("af_lang", locale);
  return url.toString();
}

const labels: Record<PlatformLocale, Record<PlatformRouteKey | "theme" | "soon" | "close" | "archiveTab" | "verifyTab" | "me", string>> = {
  en: { home: "Home", archive: "Product", verify: "Verify", member: "Member", drop: "Reward", social: "Community", support: "Support", theme: "Appearance", soon: "SOON", close: "Close Menu", archiveTab: "Product", verifyTab: "Verify", me: "Member" },
  th: { home: "หน้าหลัก", archive: "คลังข้อมูลสินค้า", verify: "ตรวจสอบสินค้า", member: "ศูนย์สมาชิก", drop: "รางวัลดรอป", social: "ชุมชน / ฟอรัม", support: "ฝ่ายช่วยเหลือ", theme: "ธีม", soon: "เร็ว ๆ นี้", close: "ปิดเมนู", archiveTab: "คลัง", verifyTab: "ตรวจสอบ", me: "ฉัน" },
  "zh-CN": { home: "首页", archive: "产品档案", verify: "产品验证", member: "会员中心", drop: "掉落奖励", social: "社区 / 论坛", support: "客服支持", theme: "明暗模式", soon: "即将开放", close: "关闭菜单", archiveTab: "档案", verifyTab: "验证", me: "我的" },
  "zh-TW": { home: "首頁", archive: "產品檔案", verify: "產品驗證", member: "會員中心", drop: "掉落獎勵", social: "社群 / 論壇", support: "客服支援", theme: "明暗模式", soon: "即將開放", close: "關閉選單", archiveTab: "檔案", verifyTab: "驗證", me: "我的" },
  ru: { home: "Главная", archive: "Архив продуктов", verify: "Проверка продукта", member: "Центр участника", drop: "Награды Drop", social: "Сообщество / Форум", support: "Поддержка", theme: "Тема", soon: "СКОРО", close: "Закрыть меню", archiveTab: "Архив", verifyTab: "Проверка", me: "Профиль" },
};

const paths: Record<PlatformRouteKey, ReactNode> = {
  home: <path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" />,
  archive: <path d="M7 3h8l4 4v14H7zM15 3v5h4M10 12h6M10 16h6" />,
  verify: <path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4m-11-5 2 2 4-5" />,
  member: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-5 3-7 8-7s7.5 2 8 7" /></>,
  drop: <path d="M5 7h14v14H5zM9 7V4h6v3m-6 5h6m-3-3v6" />,
  social: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 20c.5-4 2.5-6 6-6s5.5 2 6 6m-1-5c1-.8 2-1 3-1 3.5 0 5.5 2 6 6" /></>,
  support: <path d="M5 13v-2a7 7 0 0 1 14 0v2M5 12H3v6h4v-6m12 0h2v6h-4v-6m0 7c-1 1.3-2.6 2-5 2" />,
};

function HighwayLink() {
  return <a className="af-platform-shell__highway" href="https://highwaythai.com/" aria-label="HIGHWAY"><span className="af-platform-shell__highway-mark" aria-hidden="true" /></a>;
}

function LineIcon({ kind }: { kind: PlatformRouteKey }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>;
}

export function PlatformAccountIcon({ kind }: { kind: PlatformAccountIconKind }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{kind === "messages" ? <><path d="M3 5h18v14H3Z" /><path d="m3 6 9 7 9-7" /></> : <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>}</svg>;
}

export type PlatformShellProps = {
  locale: PlatformLocale;
  activeKey: PlatformRouteKey;
  origins: PlatformOrigins;
  renderBrandMark: (placement: "header" | "drawer") => ReactNode;
  renderFeatureIcon: (key: PlatformRouteKey) => ReactNode;
  desktopActions: ReactNode;
  drawerThemeControl: ReactNode;
  accent?: "lime" | "verify";
  upcoming?: PlatformRouteKey[];
  className?: string;
};

export function PlatformShell({ locale, activeKey, origins, renderBrandMark, renderFeatureIcon, desktopActions, drawerThemeControl, accent = "lime", upcoming = ["social"], className = "" }: PlatformShellProps) {
  const [open, setOpen] = useState(false);
  const copy = labels[locale];
  const routes: ReadonlyArray<[PlatformRouteKey, string]> = [
    ["home", origins.website], ["archive", `${origins.website}/flowers`], ["verify", withPlatformLocale(origins.verify, locale)],
    ["drop", origins.drop], ["social", origins.social], ["support", origins.support], ["member", origins.member],
  ];
  const routeControl = (key: PlatformRouteKey, href: string, feature = false) => key === "social"
    ? <button type="button" className="af-platform-shell__route-disabled" aria-disabled="true" disabled key={key}>{feature ? renderFeatureIcon(key) : <LineIcon kind={key} />}<span>{copy[key]}</span><small>{copy.soon}</small></button>
    : <a className={activeKey === key ? "active" : ""} href={href} key={key}>{feature ? renderFeatureIcon(key) : <LineIcon kind={key} />}<span>{copy[key]}</span>{upcoming.includes(key) ? <small>{copy.soon}</small> : null}</a>;
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); };
  }, [open]);
  return <>
    <header className={`af-platform-shell af-platform-shell--${accent} ${className}`.trim()} data-platform-shell-version={PLATFORM_SHELL_VERSION}>
      <div className="af-platform-shell__main">
        <button className={`af-platform-shell__menu${open ? " open" : ""}`} type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Menu"><i /><i /><i /></button>
        <div className="af-platform-shell__brand">{renderBrandMark("header")}<a href={origins.website}><strong>ALIEN FARMERS</strong></a></div>
        <div className="af-platform-shell__actions">{desktopActions}</div>
      </div>
      <nav className="af-platform-shell__shortcuts" aria-label="Quick Access">{routes.map(([key, href]) => routeControl(key, href))}<HighwayLink /></nav>
    </header>
    <PlatformDrawer open={open} onClose={() => setOpen(false)} locale={locale} accent={accent} brand={<>{renderBrandMark("drawer")}<a href={origins.website}><strong>ALIEN FARMERS</strong></a></>} themeControl={drawerThemeControl}>{routes.map(([key, href]) => routeControl(key, href, true))}<HighwayLink /></PlatformDrawer>
    {open ? <button className="af-platform-shell__scrim" type="button" onPointerDown={() => setOpen(false)} onClick={() => setOpen(false)} aria-label={copy.close} /> : null}
    <nav className={`af-platform-shell__mobile af-platform-shell__mobile--${accent}`} aria-label="Primary Navigation">{([['home', origins.website], ['archive', `${origins.website}/flowers`], ['verify', withPlatformLocale(origins.verify, locale)], ['member', origins.member]] as Array<[PlatformRouteKey,string]>).map(([key, href]) => <a className={activeKey === key ? "active" : ""} href={href} key={key}><LineIcon kind={key} /><span>{key === "archive" ? copy.archiveTab : key === "verify" ? copy.verifyTab : key === "member" ? copy.me : copy[key]}</span></a>)}</nav>
  </>;
}


export function PlatformDrawer({open, onClose, locale, accent, brand, themeControl, children}: {open: boolean; onClose: () => void; locale: PlatformLocale; accent: "lime" | "verify"; brand: ReactNode; themeControl: ReactNode; children: ReactNode}) {
  const copy = labels[locale];
  const themeRef = useRef<HTMLDivElement>(null);
  return <aside className={`af-platform-shell__drawer af-platform-shell__drawer--${accent}${open ? " open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="af-platform-shell__drawer-head"><div className="af-platform-shell__brand">{brand}</div><div className="af-platform-shell__drawer-head-actions"><button className="af-platform-shell__drawer-head-theme" type="button" onClick={() => { themeRef.current?.querySelector<HTMLButtonElement>("button")?.click(); }} aria-label={copy.theme}><svg className="af-platform-shell__drawer-head-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg><svg className="af-platform-shell__drawer-head-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg></button><button className="af-platform-shell__drawer-close" type="button" onClick={onClose} aria-label={copy.close}>×</button></div></div>
      <nav>{children}</nav>
      <div className="af-platform-shell__drawer-settings"><div className="af-platform-shell__drawer-theme"><span>{copy.theme}</span><div className="af-platform-shell__theme-control" ref={themeRef}>{themeControl}</div></div>
      <EffectsControl locale={locale} /></div>
    </aside>;
}
