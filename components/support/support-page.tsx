'use client';
import {useCallback,useLayoutEffect,useState,type ReactNode} from 'react';
import {ClipboardList,MessageCircle,Info,ArrowUpRight,ArrowLeft} from 'lucide-react';
import {I18nProvider,useI18n} from '@/lib/support/i18n';
import {ticketText} from '@/lib/support/ticket-copy';
import {PlatformNavigation} from '@/components/platform-navigation';
import type {MemberProfile} from '@/lib/member-navigation';
import {platformOrigins} from '@/lib/platform-environment';
import {TicketCenter} from './ticket-center';
export function SupportPage({initialTheme='dark',tickets=false}:{initialTheme?:'dark'|'light';tickets?:boolean}){return <I18nProvider><SupportContent initialTheme={initialTheme} tickets={tickets}/></I18nProvider>;}
function SupportContent({initialTheme,tickets}:{initialTheme:'dark'|'light';tickets:boolean}){
 const {locale,applyMemberPreference}=useI18n(),copy=(key:string)=>ticketText(key,locale),[theme,setTheme]=useState(initialTheme),[member,setMember]=useState<MemberProfile|null>(null),[ready,setReady]=useState(false);
 useLayoutEffect(()=>{const sync=()=>setTheme(document.documentElement.dataset.theme==='light'?'light':'dark');sync();window.addEventListener('alien-farmers-theme-change',sync);return()=>window.removeEventListener('alien-farmers-theme-change',sync);},[]);
 const session=useCallback((profile:MemberProfile|null)=>{setMember(profile);setReady(true);if(profile)applyMemberPreference(profile.preferredLocale);},[applyMemberPreference]);
 function toggle(){const next=theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;setTheme(next);}
 const entries:{title:string;description:string;href:string;icon:ReactNode}[]=[{title:'Service tickets',description:'Ask about a product or request after-sales help.',href:'/tickets',icon:<ClipboardList/>},{title:'Live support',description:'Talk with our support team.',href:'/chat',icon:<MessageCircle/>},{title:'About us',description:'Get to know ALIEN FARMERS.',href:`${platformOrigins.website}/about`,icon:<Info/>}];
 return <main className={'support-portal theme-'+theme}><PlatformNavigation theme={theme} toggleTheme={toggle} unreadMessageCount={0} onSessionChange={session}/><section className="support-content">{tickets?<><a className="support-back" href="/"><ArrowLeft size={16}/>{copy('Back to support')}</a><h1>{copy('Service tickets')}</h1><TicketCenter member={member} ready={ready}/></>:<><p className="support-eyebrow">ALIEN FARMERS</p><h1>{copy('Customer support')}</h1><p className="support-intro">{copy('How can we help?')}</p><div className="support-entry-grid">{entries.map((entry,index)=><a className="support-entry" key={entry.title} href={entry.href}><span className="support-entry-top">{entry.icon}<small>0{index+1}</small></span><h2>{copy(entry.title)}</h2><p>{copy(entry.description)}</p><ArrowUpRight className="support-entry-arrow"/></a>)}</div></>}</section></main>;
}
