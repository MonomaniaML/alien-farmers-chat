'use client';
import { useState } from 'react';
import { Zap, BookOpen, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n, languages } from '@/lib/support/i18n';
import type { SupportSettings, ContentLanguage } from '@/lib/support/preview-data';
export function ReplyTools({settings,insert}:{settings:SupportSettings;insert:(body:string)=>void}){
 const {t,locale}=useI18n(),[contentLanguage,setContentLanguage]=useState<ContentLanguage>(locale),[tab,setTab]=useState<'replies'|'knowledge'|null>(null),[query,setQuery]=useState('');
 const entries=tab==='replies'?settings.quickReplies.map(r=>({id:r.id,title:r.title,body:r.bodies[contentLanguage]||r.bodies.en})):settings.articles.filter(a=>a.published);
 const filtered=entries.filter(r=>(r.title+' '+r.body).toLowerCase().includes(query.toLowerCase()));
 return <div className="reply-tools"><div className="reply-toolbar"><Button variant="ghost" aria-expanded={tab==='replies'} onClick={()=>setTab(tab==='replies'?null:'replies')}><Zap size={16}/>{t('Quick replies')}</Button><Button variant="ghost" aria-expanded={tab==='knowledge'} onClick={()=>setTab(tab==='knowledge'?null:'knowledge')}><BookOpen size={16}/>{t('Knowledge base')}</Button></div>{tab&&<section className="reply-picker" aria-label={t(tab==='replies'?'Quick replies':'Knowledge base')}><header><strong>{t(tab==='replies'?'Quick replies':'Knowledge base')}</strong><Button size="icon" variant="ghost" aria-label={t('Close')} onClick={()=>setTab(null)}><X size={16}/></Button></header>{tab==="replies"&&<label className="reply-content-language">{t("Content language")}<select value={contentLanguage} onChange={e=>setContentLanguage(e.target.value as ContentLanguage)}>{Object.entries(languages).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>}<div className="answer-search"><Search size={15}/><Input value={query} placeholder={t('Search answers')} aria-label={t('Search answers')} onChange={e=>setQuery(e.target.value)}/></div><div className="answer-results">{filtered.map(r=><button key={r.id} disabled={!r.body.trim()} onClick={()=>{insert(r.body);setTab(null);}}><strong>{r.title}</strong><p>{r.body}</p><small>{t('Insert reply')} ↗</small></button>)}{!filtered.length&&<p>{t('No matching answers')}</p>}</div><footer>{t('Edit an answer before sending.')}</footer></section>}</div>;
}
