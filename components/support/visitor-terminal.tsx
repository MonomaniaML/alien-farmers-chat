'use client';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ASSISTANTS, assistantById, isAnonymousAssistantAvailable } from '@/lib/assistant-chat/config';
import { useAssistantCenter } from '@/hooks/use-assistant-center';
import { ConversationList } from '@/components/assistant-chat/conversation-list';
import { ChatWindow } from '@/components/assistant-chat/chat-window';
import { I18nProvider, useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';
import { BrandMark } from '@/components/brand-mark';
import { openMemberAuth } from '@/components/member-profile-navigation';
import { PlatformNavigation } from '@/components/platform-navigation';
import type { MemberProfile } from '@/lib/member-navigation';
import { MemberAccessGate, type VisitorAccess } from '@/components/assistant-chat/member-access-gate';
import { useCloudSupport } from '@/hooks/use-cloud-support';

const accessKey='af-chat-access:v1';

export function VisitorTerminal({initialTheme='dark',initialAssistant}:{initialTheme?:'dark'|'light';initialAssistant?:string}={}){return <I18nProvider><ConversationCenter initialTheme={initialTheme} initialAssistant={initialAssistant}/></I18nProvider>;}
function ConversationCenter({initialTheme,initialAssistant}:{initialTheme:'dark'|'light';initialAssistant?:string}){
 const {locale,applyMemberPreference}=useI18n(),copy=(text:string)=>assistantText(text,locale),center=useAssistantCenter(),cloud=useCloudSupport(locale),[theme,setTheme]=useState<'dark'|'light'>(initialTheme),[access,setAccess]=useState<VisitorAccess|null>(null),[gateOpen,setGateOpen]=useState(false),anonymous=access!=='member',candidateId=center.activeId||center.state.lastOpened,candidate=assistantById(candidateId)||ASSISTANTS[0],assistant=anonymous&&!isAnonymousAssistantAvailable(candidate)?ASSISTANTS[0]:candidate,selectedId=assistant.id,localConversation=center.state.conversations[assistant.id],conversation=assistant.id==='customer-support'?{...(cloud.conversation||localConversation),messages:cloud.conversation?.messages||[],draft:localConversation.draft}:localConversation,unreadMessageCount=Object.values(center.state.conversations).reduce((total,item)=>total+item.unread,0);
 useLayoutEffect(()=>{const sync=()=>setTheme(document.documentElement.dataset.theme==='light'?'light':'dark');sync();window.addEventListener('alien-farmers-theme-change',sync);return()=>window.removeEventListener('alien-farmers-theme-change',sync);},[]);
 useEffect(()=>{if(center.ready&&initialAssistant)center.select(initialAssistant);},[center.ready,initialAssistant]);
 function toggleTheme(){setTheme(current=>{const next=current==='dark'?'light':'dark';document.documentElement.dataset.theme=next;return next;});}
 function handleSession(next:MemberProfile|null){if(next){applyMemberPreference(next.preferredLocale);setAccess('member');setGateOpen(false);try{localStorage.setItem(accessKey,'member');}catch{}return;}let saved:string|null=null;try{saved=localStorage.getItem(accessKey);}catch{}if(saved==='anonymous')setAccess('anonymous');else{setAccess(null);setGateOpen(true);}}
 function continueAnonymously(){setAccess('anonymous');setGateOpen(false);try{localStorage.setItem(accessKey,'anonymous');}catch{}}
 function authenticate(){setGateOpen(false);queueMicrotask(()=>openMemberAuth('login'));}
 function selectAssistant(id:string){const target=assistantById(id);if(anonymous&&target&&!isAnonymousAssistantAvailable(target)){openMemberAuth('login');return;}center.select(id);}
 if(!center.ready)return <main className="assistant-center-loading"><BrandMark interactive={false}/><p>{copy('Opening conversations…')}</p></main>;
 const send=()=>{if(assistant.id!=='customer-support'){center.send(assistant.id,conversation.draft);return;}if(!cloud.conversation)return;const body=conversation.draft;center.setDraft(assistant.id,'');void cloud.send(body).then(sent=>{if(!sent)center.setDraft(assistant.id,body);});};
 return <main className={'assistant-center theme-'+theme+' '+(center.mobileOpen?'mobile-chat-open':'mobile-list-open')}>
  <PlatformNavigation theme={theme} toggleTheme={toggleTheme} unreadMessageCount={unreadMessageCount} onSessionChange={handleSession}/>
  <div className="assistant-workspace">
   <ConversationList state={center.state} selectedId={selectedId} onSelect={selectAssistant} anonymous={anonymous} onLockedSelect={()=>openMemberAuth('login')}/>
   <div className="assistant-cloud-column">{assistant.id==='customer-support'&&cloud.error&&<div className="connection-banner"><span>{cloud.error}</span><button type="button" onClick={()=>void cloud.refresh()}>{copy('Retry')}</button></div>}<ChatWindow assistant={assistant} conversation={conversation} typing={assistant.id==='customer-support'?cloud.sending:center.typingId===assistant.id} newMessageId={center.newMessageId} supportOnline={assistant.id==='customer-support'?Boolean(cloud.conversation):center.state.supportOnline} onBack={center.back} onDraft={value=>center.setDraft(assistant.id,value)} onSend={send} sendDisabled={assistant.id==='customer-support'&&!cloud.conversation} onAction={item=>{if(anonymous&&(item.value==='delivery'||item.value==='wholesale')){openMemberAuth('login');return;}center.action(assistant.id,item);}} onToggleSupport={center.toggleSupport} cloudPersisted={assistant.id==='customer-support'&&Boolean(cloud.conversation)}/></div>
  </div>
  <MemberAccessGate open={gateOpen} onOpenChange={setGateOpen} onContinueAnonymous={continueAnonymously} onAuthenticate={authenticate} theme={theme}/>
 </main>;
}
