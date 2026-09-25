'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ASSISTANTS, assistantById, isAnonymousAssistantAvailable, isUnreleasedAssistant } from '@/lib/assistant-chat/config';
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
type MemberChannelId='delivery'|'feedback'|'wholesale';
const blankCloudConversation={messages:[],unread:0,updatedAt:'',draft:''};
function isMemberChannel(id:string):id is MemberChannelId{return id==='delivery'||id==='feedback'||id==='wholesale';}

export function VisitorTerminal({initialTheme='dark',initialAssistant}:{initialTheme?:'dark'|'light';initialAssistant?:string}={}){return <I18nProvider><ConversationCenter initialTheme={initialTheme} initialAssistant={initialAssistant}/></I18nProvider>;}
function ConversationCenter({initialTheme,initialAssistant}:{initialTheme:'dark'|'light';initialAssistant?:string}){
 const {locale,applyMemberPreference}=useI18n();
 const copy=(text:string)=>assistantText(text,locale);
 const center=useAssistantCenter();
 const [theme,setTheme]=useState<'dark'|'light'>(initialTheme);
 const [access,setAccess]=useState<VisitorAccess|null>(null);
 const [memberId,setMemberId]=useState<string|null>(null);
 const [gateOpen,setGateOpen]=useState(false);
 const [activated,setActivated]=useState<Partial<Record<MemberChannelId,boolean>>>({});
 const [memberDrafts,setMemberDrafts]=useState<Partial<Record<MemberChannelId,string>>>({});
 const memberIdRef=useRef(memberId);
 memberIdRef.current=memberId;
 const supportCloud=useCloudSupport(locale,'human_support',true,memberId||'guest');
 const anonymous=access!=='member';
 const candidateId=center.activeId||center.state.lastOpened;
 const candidate=assistantById(candidateId)||ASSISTANTS[0];
 const assistant=anonymous&&!isAnonymousAssistantAvailable(candidate)?ASSISTANTS[0]:candidate;
 const selectedId=assistant.id;
 const memberChannel=isMemberChannel(selectedId)?selectedId:null;
 const deliveryCloud=useCloudSupport(locale,'delivery',access==='member'&&Boolean(memberId)&&(selectedId==='delivery'||Boolean(activated.delivery)),memberId||'guest');
 const feedbackCloud=useCloudSupport(locale,'feedback_private',access==='member'&&Boolean(memberId)&&(selectedId==='feedback'||Boolean(activated.feedback)),memberId||'guest');
 const wholesaleCloud=useCloudSupport(locale,'wholesale',access==='member'&&Boolean(memberId)&&(selectedId==='wholesale'||Boolean(activated.wholesale)),memberId||'guest');
 const unreleased=isUnreleasedAssistant(assistant);
 const noticeKind=unreleased?'unreleased' as const:selectedId==='af-ai'?'local' as const:selectedId==='delivery'?'delivery' as const:selectedId==='wholesale'?'wholesale' as const:null;
 const isCloud=selectedId==='customer-support'||Boolean(memberChannel);
 const selectedCloud=selectedId==='delivery'?deliveryCloud:selectedId==='feedback'?feedbackCloud:selectedId==='wholesale'?wholesaleCloud:supportCloud;
 const selectedCloudConnected=selectedCloud.available;
 const supportConnected=supportCloud.available;
 const localConversation=center.state.conversations[selectedId];
 const conversation=isCloud?{...(selectedCloud.conversation||blankCloudConversation),messages:selectedCloud.conversation?.messages||[],draft:memberChannel?memberDrafts[memberChannel]||'':localConversation.draft}:localConversation;
 const unreadMessageCount=Object.entries(center.state.conversations).reduce((total,[id,item])=>total+(id==='af-ai'?item.unread:0),0);
 useLayoutEffect(()=>{const sync=()=>setTheme(document.documentElement.dataset.theme==='light'?'light':'dark');sync();window.addEventListener('alien-farmers-theme-change',sync);return()=>window.removeEventListener('alien-farmers-theme-change',sync);},[]);
 useEffect(()=>{if(center.ready&&initialAssistant){if(isMemberChannel(initialAssistant))setActivated(current=>({...current,[initialAssistant]:true}));center.select(initialAssistant);}},[center.ready,initialAssistant]);
 function toggleTheme(){setTheme(current=>{const next=current==='dark'?'light':'dark';document.documentElement.dataset.theme=next;return next;});}
 function handleSession(next:MemberProfile|null){if(next){applyMemberPreference(next.preferredLocale);if(memberId!==next.userId){setMemberDrafts({});setActivated({});}setMemberId(next.userId);setAccess('member');setGateOpen(false);try{localStorage.setItem(accessKey,'member');}catch{}return;}setMemberId(null);setMemberDrafts({});setActivated({});let saved:string|null=null;try{saved=localStorage.getItem(accessKey);}catch{}if(saved==='anonymous')setAccess('anonymous');else{setAccess(null);setGateOpen(true);}}
 function continueAnonymously(){setAccess('anonymous');setGateOpen(false);try{localStorage.setItem(accessKey,'anonymous');}catch{}}
 function authenticate(){setGateOpen(false);queueMicrotask(()=>openMemberAuth('login'));}
 function selectAssistant(id:string){const target=assistantById(id);if(anonymous&&target&&!isAnonymousAssistantAvailable(target)){openMemberAuth('login');return;}if(isMemberChannel(id))setActivated(current=>({...current,[id]:true}));center.select(id);}
 if(!center.ready)return <main className="assistant-center-loading"><BrandMark interactive={false}/><p>{copy('Opening conversations…')}</p></main>;
 const send=()=>{if(unreleased)return;if(!isCloud){center.send(selectedId,conversation.draft);return;}if(!selectedCloudConnected)return;const body=conversation.draft;if(memberChannel)setMemberDrafts(current=>({...current,[memberChannel]:''}));else center.setDraft(selectedId,'');void selectedCloud.send(body).then(sent=>{if(!sent){if(memberChannel&&memberId&&memberIdRef.current===memberId)setMemberDrafts(current=>current[memberChannel]?current:{...current,[memberChannel]:body});else if(!memberChannel)center.setDraft(selectedId,body);}});};
 return <main className={'assistant-center theme-'+theme+' '+(center.mobileOpen?'mobile-chat-open':'mobile-list-open')}>
  <PlatformNavigation theme={theme} toggleTheme={toggleTheme} unreadMessageCount={unreadMessageCount} onSessionChange={handleSession}/>
  <div className="assistant-workspace">
   <ConversationList state={center.state} selectedId={selectedId} onSelect={selectAssistant} anonymous={anonymous} onLockedSelect={()=>openMemberAuth('login')} supportConnected={supportConnected} liveConversations={{'customer-support':supportCloud.conversation||blankCloudConversation,delivery:deliveryCloud.conversation||blankCloudConversation,feedback:feedbackCloud.conversation||blankCloudConversation,wholesale:wholesaleCloud.conversation||blankCloudConversation}}/>
   <div className="assistant-cloud-column">
    {isCloud&&selectedCloud.error&&<div className="connection-banner"><span>{selectedCloud.error}</span><button type="button" onClick={()=>void selectedCloud.refresh()}>{copy('Retry')}</button></div>}
    {isCloud&&localConversation.messages.some(message=>message.sender==='user')&&<p className="assistant-local-history">{copy('Earlier messages here were saved only on this device.')}</p>}
    <ChatWindow assistant={assistant} conversation={conversation} typing={isCloud?selectedCloud.sending:center.typingId===selectedId} newMessageId={center.newMessageId} supportConnected={supportConnected} onBack={center.back} onDraft={value=>memberChannel?setMemberDrafts(current=>({...current,[memberChannel]:value})):center.setDraft(selectedId,value)} onSend={send} sendDisabled={unreleased||(isCloud&&!selectedCloudConnected)} noticeKind={noticeKind} onOpenSupport={()=>center.select('customer-support')} onAction={item=>{if(anonymous&&(item.value==='delivery'||item.value==='wholesale')){openMemberAuth('login');return;}center.action(selectedId,item);}} cloudPersisted={isCloud&&selectedCloudConnected}/>
   </div>
  </div>
  <MemberAccessGate open={gateOpen} onOpenChange={setGateOpen} onContinueAnonymous={continueAnonymously} onAuthenticate={authenticate} theme={theme}/>
 </main>;
}
