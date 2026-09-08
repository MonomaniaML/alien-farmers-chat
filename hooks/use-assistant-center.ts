'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { assistantById, createInitialState } from '@/lib/assistant-chat/config';
import { INTENT_REPLIES, mockIntentMatcher } from '@/lib/assistant-chat/mock-intent';
import { loadConversationCenter, resetConversationCenter, saveConversationCenter } from '@/lib/assistant-chat/storage';
import type { AssistantConversation, ChatMessage, ConversationCenterState, QuickAction } from '@/lib/assistant-chat/types';

const makeId=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
const userMessage=(body:string,localized=false):ChatMessage=>({id:makeId(),sender:'user',body,createdAt:new Date().toISOString(),...(localized?{localized:true}:{})});
const replyMessage=(body:string,quickActions?:QuickAction[],sender:'assistant'|'staff'|'system'='assistant'):ChatMessage=>({id:makeId(),sender,body,createdAt:new Date().toISOString(),...(quickActions?.length?{quickActions}:{})});
const staffMessage=(body:string):ChatMessage=>({id:makeId(),sender:'staff',body,createdAt:new Date().toISOString()});
type Reply={message:ChatMessage};

function buildReply(id:string,input:string,_conversation:AssistantConversation,supportOnline:boolean):Reply{
 const assistant=assistantById(id);
 if(assistant?.type==='ai'){
  const intent=mockIntentMatcher(input);
  if(intent==='unknown')return {message:replyMessage('For help with this question, please contact Customer Support.',[{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
  const actions:QuickAction[]=[];
  if(['delivery','wholesale','human'].includes(intent))actions.push({label:intent==='delivery'?'Open Delivery Assistant':intent==='wholesale'?'Open Wholesale Assistant':'Talk to Staff',value:intent,action:intent==='human'?'open_support':'message'});
  return {message:replyMessage(INTENT_REPLIES[intent],actions)};
 }
 if(assistant?.type==='support')return {message:supportOnline?replyMessage('Your message is waiting for Customer Support.',undefined,'system'):replyMessage('Customer Support is currently offline. Your message remains on this device.',undefined,'system')};
 if(assistant?.type==='delivery')return {message:replyMessage('Delivery tracking is not available in this chat yet. Please contact Customer Support and include your order number.',[{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
 if(assistant?.type==='feedback')return {message:replyMessage('Private feedback delivery is not available in this chat yet.')};
 return {message:replyMessage('Wholesale inquiry delivery is not available in this chat yet. Please contact Customer Support.',[{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
}

export function useAssistantCenter(){
 const [state,setState]=useState<ConversationCenterState>(createInitialState),[ready,setReady]=useState(false),[activeId,setActiveId]=useState<string|null>(null),[mobileOpen,setMobileOpen]=useState(false),[typingId,setTypingId]=useState<string|null>(null),[newMessageId,setNewMessageId]=useState<string|null>(null);
 const stateRef=useRef(state),activeIdRef=useRef(activeId),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{queueMicrotask(()=>{const loaded=loadConversationCenter(),opened=loaded.conversations[loaded.lastOpened];setState(loaded);setActiveId(loaded.lastOpened);if(opened?.unread)setNewMessageId(opened.messages.at(-1)?.id||null);setReady(true);});},[]);
 useEffect(()=>{stateRef.current=state;if(ready)saveConversationCenter(state);},[state,ready]);
 useEffect(()=>{activeIdRef.current=activeId;},[activeId]);
 useEffect(()=>{const sync=()=>{const loaded=loadConversationCenter(),id=activeIdRef.current;if(id&&loaded.conversations[id]?.messages.at(-1)?.id!==stateRef.current.conversations[id]?.messages.at(-1)?.id)setNewMessageId(loaded.conversations[id].messages.at(-1)?.id||null);setState(loaded);};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const select=useCallback((id:string)=>{const conversation=stateRef.current.conversations[id];setNewMessageId(conversation.unread?conversation.messages.at(-1)?.id||null:null);setActiveId(id);setMobileOpen(true);setState(current=>({...current,lastOpened:id,conversations:{...current.conversations,[id]:{...current.conversations[id],unread:0}}}));},[]);
 const back=useCallback(()=>{setActiveId(null);setMobileOpen(false);},[]);
 const setDraft=useCallback((id:string,draft:string)=>setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],draft}}})),[]);
 const selectForOps=useCallback((id:string)=>{setActiveId(id);setState(current=>({...current,lastOpened:id}));},[]);
 const staffReply=useCallback((id:string,raw:string)=>{const body=raw.trim();if(!body)return;setState(current=>{const conversation=current.conversations[id];return {...current,conversations:{...current.conversations,[id]:{...conversation,updatedAt:new Date().toISOString(),conversationStatus:'active',unread:conversation.unread+1,messages:[...conversation.messages,staffMessage(body)]}}};});},[]);
 const setConversationStatus=useCallback((id:string,status:'active'|'closed')=>setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],conversationStatus:status}}})),[]);
 const send=useCallback((id:string,raw:string,localized=false)=>{const body=raw.trim();if(!body)return;const before=stateRef.current.conversations[id];const now=new Date().toISOString();setNewMessageId(null);setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],draft:'',updatedAt:now,messages:[...current.conversations[id].messages,userMessage(body,localized)],...(id==='customer-support'?{conversationStatus:'waiting' as const}:{})}}}));setTypingId(id);
  const timer=setTimeout(()=>{const result=buildReply(id,body,before,stateRef.current.supportOnline);if(activeIdRef.current===id)setNewMessageId(result.message.id);setState(current=>{const conversation=current.conversations[id];return {...current,conversations:{...current.conversations,[id]:{...conversation,updatedAt:new Date().toISOString(),messages:[...conversation.messages,result.message],unread:activeIdRef.current===id?0:conversation.unread+1,...(id==='customer-support'?{conversationStatus:current.supportOnline?'active' as const:'waiting' as const}:{})}}};});setTypingId(current=>current===id?null:current);},650);timers.current.push(timer);
 },[]);
 const action=useCallback((id:string,item:QuickAction)=>{if(item.action==='open_support'){select('customer-support');return;}if(id==='af-ai'&&item.value==='delivery'){select('delivery');return;}if(id==='af-ai'&&item.value==='wholesale'){select('wholesale');return;}send(id,item.value,true);},[select,send]);
 const toggleSupport=useCallback(()=>setState(current=>({...current,supportOnline:!current.supportOnline,conversations:{...current.conversations,'customer-support':{...current.conversations['customer-support'],conversationStatus:current.supportOnline?'waiting':'active'}}})),[]);
 const reset=useCallback(()=>{timers.current.forEach(clearTimeout);timers.current=[];const fresh=resetConversationCenter();setState(fresh);setActiveId(fresh.lastOpened);setMobileOpen(false);setTypingId(null);setNewMessageId(null);},[]);
 return {state,ready,activeId,mobileOpen,typingId,newMessageId,select,selectForOps,back,setDraft,send,staffReply,setConversationStatus,action,toggleSupport,reset};
}
