import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createStore, ApiError, AGENTS } from './store.ts';
import type { Principal } from './store.ts';
import type { Actor } from '../lib/support/types.ts';

export function createPreviewServer(file: string, seed=true) {
 const store=createStore(file); if(seed)store.seed();
 const listeners=new Set<{res:ServerResponse;principal:Principal}>();
 const limits=new Map<string,{start:number;count:number}>();
 const emit=()=>{for(const {res} of listeners)res.write('event: change\ndata: {}\n\n');};
 function json(res:ServerResponse,status:number,data:unknown){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));}
 function cookie(req:IncomingMessage,name:string){const raw=req.headers.cookie?.split(';').find(c=>c.trim().startsWith(name+'='));return raw?.trim().slice(name.length+1);}
 function setCookie(res:ServerResponse,name:string,value:string,maxAge:number){res.setHeader('Set-Cookie',`${name}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`);}
 async function body(req:IncomingMessage):Promise<Record<string,unknown>>{
  if(!req.headers['content-type']?.startsWith('application/json'))throw new ApiError(415,'JSON is required.');
  let text='';for await(const chunk of req){text+=chunk.toString();if(Buffer.byteLength(text)>250000)throw new ApiError(413,'Message is too large.');}
  try{const data:unknown=JSON.parse(text);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();return data as Record<string,unknown>;}catch{throw new ApiError(400,'Invalid request.');}
 }
 const server=createServer(async(req,res)=>{
  try{
   const host=req.headers.host||'';
   if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host))throw new ApiError(403,'This preview is local only.');
   const origin=req.headers.origin;
   if(req.headers['sec-fetch-site']==='cross-site')throw new ApiError(403,'Cross-site requests are not allowed.');
   if(req.method!=='GET'&&req.method!=='HEAD'){
    if(!origin || !['http://localhost:5173','http://127.0.0.1:5173',`http://${host}`].includes(origin))throw new ApiError(403,'A local same-origin request is required.');
   }
   const url=new URL(req.url||'/','http://'+host), path=url.pathname;
   if(path==='/preview-api/health')return json(res,200,{mode:'local-preview'});
   const actor=url.searchParams.get('actor')==='agent'?'agent':'visitor';
   if(path==='/preview-api/bootstrap'&&req.method==='POST'){
    const data=await body(req), result=store.bootstrap(cookie(req,'af_preview_visitor'),typeof data.source==='string'?data.source:'direct',typeof data.language==='string'?data.language:'en');
    setCookie(res,'af_preview_visitor',result.token,31536000);emit();return json(res,200,store.snapshot(result.principal));
   }
   if(path==='/preview-api/agent/session'&&req.method==='POST'){
    const data=await body(req),result=store.agentSession(typeof data.agentId==='string'?data.agentId:AGENTS[0].id);
    setCookie(res,'af_preview_agent',result.token,86400);return json(res,200,store.snapshot(result.principal));
   }
   const principal=store.tokenPrincipal(actor as Actor,cookie(req,actor==='agent'?'af_preview_agent':'af_preview_visitor'));
   if(path==='/preview-api/snapshot'&&req.method==='GET')return json(res,200,store.snapshot(principal));
   if(path==='/preview-api/events'&&req.method==='GET'){
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
    const item={res,principal};listeners.add(item);res.write('retry: 1200\nevent: change\ndata: {}\n\n');
    const timer=setInterval(()=>res.write(': heartbeat\n\n'),15000);
    res.on('close',()=>{clearInterval(timer);listeners.delete(item);});return;
   }
   if(req.method!=='POST')throw new ApiError(404,'Not found.');
   const data=await body(req);
   if(path==='/preview-api/context'){store.setContext(principal,data);emit();return json(res,200,store.snapshot(principal));}
   if(path==='/preview-api/settings'){store.saveSettings(principal,data);emit();return json(res,200,store.snapshot(principal));}
   if(path==='/preview-api/presence'){
    if(typeof data.tabId!=='string'||data.tabId.length>80)throw new ApiError(400,'Invalid tab.');
    if(data.conversationId!==null&&typeof data.conversationId!=='string')throw new ApiError(400,'Invalid conversation.');
    store.heartbeat(principal,data.tabId,data.conversationId as string|null,data.typing===true,data.leave===true);emit();return json(res,200,{ok:true});
   }
   const match=path.match(/^\/preview-api\/conversations\/([0-9a-f-]{36})\/(messages|action)$/i);
   if(!match)throw new ApiError(404,'Not found.');
   if(match[2]==='messages'){
    if(typeof data.body!=='string'||!data.body.trim()||data.body.length>4000)throw new ApiError(400,'Write a message of 1–4,000 characters.');
    if(typeof data.clientMessageId!=='string'||!/^[0-9a-f-]{36}$/i.test(data.clientMessageId))throw new ApiError(400,'Invalid message ID.');
    const key=principal.actor+principal.id, now=Date.now(),limit=limits.get(key);
    if(!limit||now-limit.start>60000)limits.set(key,{start:now,count:1});else if(++limit.count>100)throw new ApiError(429,'Please wait a moment before sending more messages.');
    const message=store.send(principal,match[1],data.body.trim(),data.clientMessageId);emit();return json(res,200,message);
   }
   if(store.update(principal,match[1],String(data.action),data.value))emit();return json(res,200,{ok:true});
  }catch(error){json(res,error instanceof ApiError?error.status:500,{error:error instanceof ApiError?error.message:'The local preview service could not complete this request.'});}
 });
 return {server,store,close:async()=>{for(const {res}of listeners)res.end();await new Promise<void>((resolve,reject)=>server.close(error=>error?reject(error):resolve()));store.close();}};
}
