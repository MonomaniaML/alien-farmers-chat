'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { ASSISTANTS, assistantById, isAnonymousAssistantAvailable } from '@/lib/assistant-chat/config';
import { useAssistantCenter } from '@/hooks/use-assistant-center';
import { ConversationList } from '@/components/assistant-chat/conversation-list';
import { ChatWindow } from '@/components/assistant-chat/chat-window';
import { I18nProvider, LanguagePicker, memberLocale, useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';
import { BrandMark } from '@/components/brand-mark';
import { MemberProfileNavigation, openMemberAuth } from '@/components/member-profile-navigation';
import type { MemberProfile } from '@/lib/member-navigation';
import { MemberAccessGate, type VisitorAccess } from '@/components/assistant-chat/member-access-gate';

const accessKey='af-chat-access:v1';

export function VisitorTerminal(){return <I18nProvider><ConversationCenter/></I18nProvider>;}
function ConversationCenter(){
 const {locale,setLocale}=useI18n(),copy=(text:string)=>assistantText(text,locale),center=useAssistantCenter(),[theme,setTheme]=useState<'dark'|'light'>('dark'),[access,setAccess]=useState<VisitorAccess|null>(null),[gateOpen,setGateOpen]=useState(false),anonymous=access!=='member',candidateId=center.activeId||center.state.lastOpened,candidate=assistantById(candidateId)||ASSISTANTS[0],assistant=anonymous&&!isAnonymousAssistantAvailable(candidate)?ASSISTANTS[0]:candidate,selectedId=assistant.id,conversation=center.state.conversations[assistant.id],unreadMessageCount=Object.values(center.state.conversations).reduce((total,item)=>total+item.unread,0);
 useEffect(()=>{queueMicrotask(()=>{try{setTheme(localStorage.getItem('af-chat-theme')==='light'?'light':'dark');}catch{}});},[]);
 function toggleTheme(){setTheme(current=>{const next=current==='dark'?'light':'dark';try{localStorage.setItem('af-chat-theme',next);}catch{}return next;});}
 function handleSession(next:MemberProfile|null){if(next){const preferred=memberLocale(next.preferredLocale);if(preferred!==locale)setLocale(preferred);setAccess('member');setGateOpen(false);try{localStorage.setItem(accessKey,'member');}catch{}return;}let saved:string|null=null;try{saved=localStorage.getItem(accessKey);}catch{}if(saved==='anonymous')setAccess('anonymous');else{setAccess(null);setGateOpen(true);}}
 function continueAnonymously(){setAccess('anonymous');setGateOpen(false);try{localStorage.setItem(accessKey,'anonymous');}catch{}}
 function authenticate(){setGateOpen(false);queueMicrotask(()=>openMemberAuth('login'));}
 function selectAssistant(id:string){const target=assistantById(id);if(anonymous&&target&&!isAnonymousAssistantAvailable(target)){openMemberAuth('login');return;}center.select(id);}
 if(!center.ready)return <main className="assistant-center-loading"><BrandMark interactive={false}/><p>{copy('Opening conversations…')}</p></main>;
 const send=()=>center.send(assistant.id,conversation.draft);
 return <main className={'assistant-center theme-'+theme+' '+(center.mobileOpen?'mobile-chat-open':'mobile-list-open')}>
  <header className="assistant-global-header"><div className="assistant-brand"><BrandMark/><Link href="/"><strong>ALIEN FARMERS</strong><small>{copy('Conversation Center')}</small></Link></div><div className="assistant-global-actions"><button className="assistant-theme-toggle" onClick={toggleTheme} aria-label={copy(theme==='dark'?'Light mode':'Dark mode')} title={copy(theme==='dark'?'Light mode':'Dark mode')}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><LanguagePicker/><MemberProfileNavigation locale={locale} unreadMessageCount={unreadMessageCount} onSessionChange={handleSession} theme={theme}/></div></header>
  <div className="assistant-workspace">
   <ConversationList state={center.state} selectedId={selectedId} onSelect={selectAssistant} anonymous={anonymous} onLockedSelect={()=>openMemberAuth('login')}/>
   <ChatWindow assistant={assistant} conversation={conversation} typing={center.typingId===assistant.id} newMessageId={center.newMessageId} supportOnline={center.state.supportOnline} onBack={center.back} onDraft={value=>center.setDraft(assistant.id,value)} onSend={send} onAction={item=>{if(anonymous&&(item.value==='delivery'||item.value==='wholesale')){openMemberAuth('login');return;}center.action(assistant.id,item);}} onToggleSupport={center.toggleSupport}/>
  </div>
  <MemberAccessGate open={gateOpen} onOpenChange={setGateOpen} onContinueAnonymous={continueAnonymously} onAuthenticate={authenticate} theme={theme}/>
 </main>;
}
