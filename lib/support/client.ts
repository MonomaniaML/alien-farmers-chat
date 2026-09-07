import type { Actor, Snapshot } from './types';

export class RequestError extends Error { status: number; constructor(message:string,status:number){super(message);this.status=status;} }
export async function request<T>(path:string,actor:Actor,body?:unknown):Promise<T>{
 const response=await fetch('/preview-api'+path+(path.includes('?')?'&':'?')+'actor='+actor,{
  method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',
  headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(12000),
 }).catch(()=>{throw new RequestError('Connection interrupted. Your messages are saved on this device.',0);});
 const result=await response.json().catch(()=>{throw new RequestError('Support is temporarily unavailable. Please reconnect.',response.status);});
 if(!response.ok)throw new RequestError(result&&typeof result==='object'&&'error' in result&&typeof result.error==='string'?result.error:'Unable to reach support.',response.status);
 return result as T;
}
let initialization:Promise<Snapshot>|null=null;
export async function initialize(actor:Actor):Promise<Snapshot>{
 if(actor==='agent'){
  try{return await request<Snapshot>('/snapshot',actor);}catch(error){if(!(error instanceof RequestError)||error.status!==401)throw error;return request<Snapshot>('/agent/session',actor,{});}
 }
 const run=async()=>{const source=new URLSearchParams(location.search).get('from')||'direct';return request<Snapshot>('/bootstrap',actor,{source,language:navigator.language});};
 if(!initialization){
  initialization=(async()=>navigator.locks?await navigator.locks.request('af-support-preview-identity',run):await run())().finally(()=>{initialization=null;});
 }
 return initialization!;
}
// Local SSE transport only. Supabase private-channel implementation replaces this adapter.
export const supportChatRealtime={
 subscribe(actor:Actor,onChange:()=>void,onState:(connected:boolean)=>void){
  const stream=new EventSource('/preview-api/events?actor='+actor);
  stream.addEventListener('change',onChange);stream.onopen=()=>onState(true);stream.onerror=()=>onState(false);
  return()=>stream.close();
 },
 sendTyping(actor:Actor,tabId:string,conversationId:string|null,typing:boolean,leave=false){
  return request('/presence',actor,{tabId,conversationId,typing,leave});
 },
};
