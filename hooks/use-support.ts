'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Actor, ConnectionState, Message, OutboxItem, Snapshot } from '@/lib/support/types';
import { initialize, request, supportChatRealtime } from '@/lib/support/client';
import { readOutbox, removeOutbox, saveOutbox } from '@/lib/support/outbox';

export function useSupport(actor:Actor){
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[error,setError]=useState(''),[connection,setConnection]=useState<ConnectionState>('connecting'),[outbox,setOutbox]=useState<OutboxItem[]>([]);
 const state=useRef(snapshot);
 useEffect(()=>{state.current=snapshot;},[snapshot]);
 const mounted=useRef(true),busy=useRef(false),fetching=useRef(false),again=useRef(false);
 const owner=snapshot?actor+':'+snapshot.actorId:'';
 const refresh=useCallback(async function refreshSnapshot(){
  if(fetching.current){again.current=true;return;}
  fetching.current=true;
  try{const value=await request<Snapshot>('/snapshot',actor);if(mounted.current){setSnapshot(value);setError('');}}
  catch(cause){if(mounted.current){setError(cause instanceof Error?cause.message:'Connection interrupted.');setConnection('reconnecting');}}
  finally{fetching.current=false;if(again.current){again.current=false;setTimeout(()=>void refreshSnapshot(),100);}}
 },[actor]);
 const connect=useCallback(async()=>{
  setConnection('connecting');
  try{const value=await initialize(actor);if(mounted.current){setSnapshot(value);setError('');}}
  catch(cause){if(mounted.current){setError(cause instanceof Error?cause.message:'Unable to connect.');setConnection('reconnecting');}}
 },[actor]);
 useEffect(()=>{mounted.current=true;queueMicrotask(()=>void connect());return()=>{mounted.current=false;};},[connect]);
 useEffect(()=>{
  if(!snapshot?.actorId)return;
  const unsubscribe=supportChatRealtime.subscribe(actor,()=>void refresh(),connected=>setConnection(connected?'connected':'reconnecting'));
  const interval=setInterval(()=>void refresh(),6000),online=()=>{void refresh();},offline=()=>setConnection('reconnecting');
  window.addEventListener('online',online);window.addEventListener('offline',offline);
  return()=>{unsubscribe();clearInterval(interval);window.removeEventListener('online',online);window.removeEventListener('offline',offline);};
 },[actor,snapshot?.actorId,refresh]);
 const flush=useCallback(async()=>{
  if(!owner||busy.current||!navigator.onLine)return;
  busy.current=true;
  try{for(const item of readOutbox(owner)){
   if(!mounted.current||actor+':'+state.current?.actorId!==owner)break;
   try{
    saveOutbox(owner,{...item,state:'sending',error:undefined});
    await request<Message>('/conversations/'+item.conversationId+'/messages',actor,{body:item.body,clientMessageId:item.id});
    removeOutbox(owner,item.id);await refresh();
   }catch(cause){saveOutbox(owner,{...item,state:'failed',error:cause instanceof Error?cause.message:'Message not sent.'});break;}
  }}finally{busy.current=false;}
  // oxlint-disable-next-line react/react-compiler -- The outbox event listener must retain explicit actor and owner isolation.
  },[actor,owner,refresh]);
 useEffect(()=>{
  if(!owner)return;
  const sync=()=>{try{setOutbox(readOutbox(owner));}catch{setError('Browser storage is unavailable. Keep this page open to preserve your draft.');}};
  queueMicrotask(()=>{sync();void flush();});
  const interval=setInterval(()=>void flush(),8000);
  window.addEventListener('storage',sync);window.addEventListener('af-outbox',sync);window.addEventListener('online',flush);
  return()=>{clearInterval(interval);window.removeEventListener('storage',sync);window.removeEventListener('af-outbox',sync);window.removeEventListener('online',flush);};
 },[owner,flush]);
 const send=useCallback(async(conversationId:string,body:string)=>{
  if(!owner||!body.trim()||body.trim().length>4000)throw new Error('Write a message of 1–4,000 characters.');
  const item:OutboxItem={id:crypto.randomUUID(),conversationId,body:body.trim(),createdAt:new Date().toISOString(),state:'pending'};
  saveOutbox(owner,item);void flush();return item.id;
 },[owner,flush]);
 const action=useCallback(async(id:string,actionName:string,value:unknown)=>{
  await request('/conversations/'+id+'/action',actor,{action:actionName,value});await refresh();
 },[actor,refresh]);
 const switchAgent=useCallback(async(agentId:string)=>{
  const value=await request<Snapshot>('/agent/session','agent',{agentId});setSnapshot(value);
 },[]);
 return {snapshot,error,connection,outbox,send,action,retry:flush,reconnect:connect,refresh,switchAgent};
}

export function usePresence(actor:Actor,ready:boolean,conversationId:string|null){
 const tabId=useRef(''),typing=useRef(false),last=useRef(0);
 const sendPresence=useCallback((value:boolean,leave=false)=>{
  if(!ready)return;
  tabId.current||=crypto.randomUUID();
  void supportChatRealtime.sendTyping(actor,tabId.current,conversationId,value,leave).catch(()=>{});
 },[actor,conversationId,ready]);
 useEffect(()=>{
  if(!ready)return;
  sendPresence(false);
  const timer=setInterval(()=>{if(!document.hidden)sendPresence(typing.current);},15000);
  const visibility=()=>{typing.current=false;sendPresence(false,document.hidden);};
  const leave=()=>{void fetch('/preview-api/presence?actor='+actor,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tabId:tabId.current,conversationId,typing:false,leave:true}),keepalive:true}).catch(()=>{});};
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',leave);
  return()=>{clearInterval(timer);sendPresence(false,true);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',leave);};
 },[actor,conversationId,ready,sendPresence]);
 return useCallback((value:boolean)=>{typing.current=value;const now=Date.now();if(!value||now-last.current>1800){last.current=now;sendPresence(value);}},[sendPresence]);
}
