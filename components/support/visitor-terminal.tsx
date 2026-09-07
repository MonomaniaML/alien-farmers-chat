'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageCircleMore, Moon, Sun, UserRound } from 'lucide-react';
import { ASSISTANTS, assistantById, isAnonymousAssistantAvailable } from '@/lib/assistant-chat/config';
import { useAssistantCenter } from '@/hooks/use-assistant-center';
import { ConversationList } from '@/components/assistant-chat/conversation-list';
import { ChatWindow } from '@/components/assistant-chat/chat-window';
import { I18nProvider, LanguagePicker, useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';
import { BrandMark } from '@/components/brand-mark';
import { MemberAccessGate, type VisitorAccess } from '@/components/assistant-chat/member-access-gate';

const accessKey='af-chat-access:v1';

export function VisitorTerminal(){return <I18nProvider><ConversationCenter/></I18nProvider>;}
function ConversationCenter(){
 const {locale}=useI18n(),copy=(text:string)=>assistantText(text,locale),center=useAssistantCenter(),isDevelopment=process.env.NODE_ENV!=='production',[theme,setTheme]=useState<'dark'|'light'>('dark'),[access,setAccess]=useState<VisitorAccess|null>(null),[gateOpen,setGateOpen]=useState(false),candidateId=center.activeId||center.state.lastOpened,candidate=assistantById(candidateId)||ASSISTANTS[0],assistant=access==='anonymous'&&!isAnonymousAssistantAvailable(candidate)?ASSISTANTS[0]:candidate,selectedId=assistant.id,conversation=center.state.conversations[assistant.id];
 useEffect(()=>{queueMicrotask(()=>{try{setTheme(localStorage.getItem('af-chat-theme')==='light'?'light':'dark');const saved=localStorage.getItem(accessKey);if(saved==='anonymous'||saved==='member')setAccess(saved);else setGateOpen(true);}catch{setGateOpen(true);}});},[]);
 function toggleTheme(){setTheme(current=>{const next=current==='dark'?'light':'dark';try{localStorage.setItem('af-chat-theme',next);}catch{}return next;});}
 function chooseAccess(next:VisitorAccess){setAccess(next);setGateOpen(false);try{localStorage.setItem(accessKey,next);}catch{}if(next==='anonymous'&&!isAnonymousAssistantAvailable(candidate)){center.selectForOps('af-ai');center.back();}}
 function selectAssistant(id:string){const target=assistantById(id);if(access==='anonymous'&&target&&!isAnonymousAssistantAvailable(target)){setGateOpen(true);return;}center.select(id);}
 if(!center.ready)return <main className="assistant-center-loading"><BrandMark interactive={false}/><p>{copy('Opening conversations…')}</p></main>;
 const send=()=>center.send(assistant.id,conversation.draft);
 return <main className={'assistant-center theme-'+theme+' '+(center.mobileOpen?'mobile-chat-open':'mobile-list-open')}>
  <header className="assistant-global-header"><div className="assistant-brand"><BrandMark/><Link href="/"><strong>ALIEN FARMERS</strong><small>{copy('Conversation Center')}</small></Link></div><div className="assistant-global-actions"><button className="assistant-access-pill" onClick={()=>setGateOpen(true)}><UserRound size={14}/><span>{copy(access==='member'?'Member preview':'Anonymous')}</span></button><span className="local-mode"><i/>{copy(isDevelopment?'Local preview':'Test data')}</span><button className="assistant-theme-toggle" onClick={toggleTheme} aria-label={copy(theme==='dark'?'Light mode':'Dark mode')} title={copy(theme==='dark'?'Light mode':'Dark mode')}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><LanguagePicker/>{isDevelopment&&<Link href="/ops" target="_blank" aria-label={copy('Support preview')}><MessageCircleMore size={17}/><span>{copy('Support preview')}</span><ArrowUpRight size={14}/></Link>}</div></header>
  <div className="assistant-workspace">
   <ConversationList state={center.state} selectedId={selectedId} onSelect={selectAssistant} onReset={center.reset} anonymous={access==='anonymous'} onLockedSelect={()=>setGateOpen(true)}/>
   <ChatWindow assistant={assistant} conversation={conversation} typing={center.typingId===assistant.id} newMessageId={center.newMessageId} supportOnline={center.state.supportOnline} onBack={center.back} onDraft={value=>center.setDraft(assistant.id,value)} onSend={send} onAction={item=>{if(access==='anonymous'&&(item.value==='delivery'||item.value==='wholesale')){setGateOpen(true);return;}center.action(assistant.id,item);}} onToggleSupport={center.toggleSupport}/>
  </div>
  <MemberAccessGate open={gateOpen} onOpenChange={setGateOpen} onChoose={chooseAccess} theme={theme}/>
 </main>;
}
