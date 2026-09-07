'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { I18nProvider, LanguagePicker, useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';
import { DEFAULT_SETTINGS } from '@/lib/support/preview-data';
import type { SupportSettings as Config } from '@/lib/support/preview-data';
import { SupportSettings } from '@/components/support/support-settings';
import { BrandMark } from '@/components/brand-mark';

const STORAGE_KEY='af-ops-automation:v1';
export function AutomationSettings(){return <I18nProvider><AutomationSettingsWorkspace/></I18nProvider>;}
function AutomationSettingsWorkspace(){
 const {t,locale}=useI18n(),copy=(text:string)=>assistantText(text,locale),[settings,setSettings]=useState<Config|null>(null),[theme,setTheme]=useState<'light'|'dark'>('light');
 useEffect(()=>{queueMicrotask(()=>{try{const stored=localStorage.getItem(STORAGE_KEY);setSettings(stored?JSON.parse(stored) as Config:structuredClone(DEFAULT_SETTINGS));setTheme(localStorage.getItem('af-ops-theme')==='dark'?'dark':'light');}catch{setSettings(structuredClone(DEFAULT_SETTINGS));}});},[]);
 async function save(next:Config){localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setSettings(structuredClone(next));}
 function toggleTheme(){setTheme(current=>{const next=current==='light'?'dark':'light';try{localStorage.setItem('af-ops-theme',next);}catch{}return next;});}
 if(!settings)return <main className="assistant-center-loading"><BrandMark interactive={false}/><p>{t('Opening settings…')}</p></main>;
 return <main className={'assistant-settings-shell ops-theme-'+theme}><header className="assistant-ops-topbar"><div className="assistant-ops-brand"><BrandMark small/><Link href="/ops">ALIEN FARMERS<small>{t('Operations')}</small></Link></div><div className="assistant-ops-actions"><LanguagePicker/><button className="assistant-ops-theme" onClick={toggleTheme} aria-label={copy(theme==='light'?'Dark mode':'Light mode')} title={copy(theme==='light'?'Dark mode':'Light mode')}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button><Link href="/ops"><ArrowLeft size={15}/>{t('Back to Inbox')}</Link></div></header><SupportSettings initial={settings} save={save}/><p className="assistant-settings-boundary">{t('Local configuration preview. These rules are not connected to the assistant conversations yet.')}</p></main>;
}
