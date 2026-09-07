import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore, AGENTS, CUSTOMERS } from '../server/store.ts';
import { createPreviewServer } from '../server/http.ts';
import type { Snapshot } from '../lib/support/types.ts';
import { DEFAULT_SETTINGS, interactivePrompt, productUrl, sharedContext } from '../lib/support/preview-data.ts';
import { ASSISTANTS, isAnonymousAssistantAvailable } from '../lib/assistant-chat/config.ts';

void test('anonymous conversation access is limited to AI and customer support',()=>{
 const availability=Object.fromEntries(ASSISTANTS.map(assistant=>[assistant.id,isAnonymousAssistantAvailable(assistant)]));
 assert.deepEqual(availability,{'af-ai':true,'customer-support':true,delivery:false,feedback:false,wholesale:false});
});

void test('preview member context, settings permissions and multilingual automation stay isolated',()=>{
 const store=createStore(':memory:');
 try{
  const a=store.bootstrap(undefined,'website','th'),b=store.bootstrap(undefined,'direct','en'),agent=store.agentSession(AGENTS[0].id);
  store.setContext(a.principal,{member:true,productId:'field-tee',language:'th'});
  const c=store.snapshot(a.principal).conversations[0];
  assert.equal(c.context?.sourcePage,'/products/field-tee');assert.equal(c.context?.member,true);
  assert.equal(store.snapshot(b.principal).conversations[0].context?.member,false);
  assert.equal(store.snapshot(a.principal).settings,undefined);
  assert.throws(()=>store.setContext(a.principal,{productId:'https://untrusted.example'}),/Unknown preview product/);
  assert.throws(()=>store.saveSettings(a.principal,DEFAULT_SETTINGS),/Only a preview agent/);
  assert.throws(()=>store.saveSettings(agent.principal,{}),/Invalid settings/);
  const config=structuredClone(DEFAULT_SETTINGS);config.welcome.enabled=true;config.away.enabled=true;
  store.saveSettings(agent.principal,config);
  const clientId=randomUUID();store.send(a.principal,c.id,'สวัสดี',clientId);store.send(a.principal,c.id,'สวัสดี',clientId);
  let messages=store.snapshot(a.principal).conversations[0].messages;
  assert.equal(messages.filter(m=>m.clientMessageId.startsWith('auto-welcome:')).length,1);
  assert.equal(messages.at(-1)?.body,config.welcome.bodies.th);
  store.send(a.principal,c.id,'อีกคำถาม',randomUUID());store.send(a.principal,c.id,'เพิ่มเติม',randomUUID());
  messages=store.snapshot(a.principal).conversations[0].messages;
  assert.equal(messages.filter(m=>m.clientMessageId.startsWith('auto-away:')).length,1);
  store.heartbeat(agent.principal,'online',c.id,false);
  const other=store.snapshot(b.principal).conversations[0];store.send(b.principal,other.id,'Hello',randomUUID());
  assert.equal(store.snapshot(b.principal).conversations[0].messages.at(-1)?.body,config.welcome.bodies.en);
  store.setContext(a.principal,{member:false});assert.equal(store.snapshot(agent.principal).conversations.find(item=>item.id===c.id)?.customer,null);
  assert.deepEqual(sharedContext(productUrl('field-tee')),{kind:'product',id:'field-tee'});
  assert.equal(sharedContext('https://untrusted.example/products/field-tee'),null);
 }finally{store.close();}
});

void test('preview settings and member context persist across a service restart',()=>{
 const dir=mkdtempSync(join(tmpdir(),'af-preview-v2-')),file=join(dir,'test.sqlite');let store=createStore(file);
 try{const v=store.bootstrap(undefined,'website','ru'),a=store.agentSession(AGENTS[0].id),config=structuredClone(DEFAULT_SETTINGS);
  config.articles[0].body='A saved answer';config.quickReplies[0].bodies.ru='Здравствуйте!';store.saveSettings(a.principal,config);store.setContext(v.principal,{member:true,language:'ru',productId:'orbit-jar'});
  store.close();store=createStore(file);assert.equal(store.settings().articles[0].body,'A saved answer');assert.equal(store.settings().quickReplies[0].bodies.ru,'Здравствуйте!');assert.equal(store.snapshot(store.tokenPrincipal('visitor',v.token)).conversations[0].context?.productId,'orbit-jar');
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});

void test('keyword knowledge replies can answer, offer choices, and look up member orders',()=>{
 const store=createStore(':memory:');
 try{
  const visitor=store.bootstrap(undefined,'website','zh-CN'),agent=store.agentSession(AGENTS[0].id),conversation=store.snapshot(visitor.principal).conversations[0];
  const config=structuredClone(DEFAULT_SETTINGS);
  config.articles.push({id:'size-help',title:'Size help',body:'请选择需要的尺码帮助：',published:true,keywords:['尺码'],autoReply:true,responseType:'options',options:['查看尺码表','联系人工客服']});
  store.saveSettings(agent.principal,config);
  store.send(visitor.principal,conversation.id,'什么时候发货？',randomUUID());
  let prompt=interactivePrompt(store.snapshot(visitor.principal).conversations[0].messages.at(-1)!.body);
  assert.equal(prompt?.options[0].label,'我先登录');
  store.setContext(visitor.principal,{member:true});
  store.send(visitor.principal,conversation.id,'请问我的发货进度',randomUUID());
  prompt=interactivePrompt(store.snapshot(visitor.principal).conversations[0].messages.at(-1)!.body);
  assert.equal(prompt?.options.length,2);assert.equal(prompt?.options[0].value,'[af-order:AF-PREVIEW-1042]');
  store.send(visitor.principal,conversation.id,'我想问尺码',randomUUID());
  prompt=interactivePrompt(store.snapshot(visitor.principal).conversations[0].messages.at(-1)!.body);
  assert.deepEqual(prompt?.options.map(option=>option.label),['查看尺码表','联系人工客服']);
 }finally{store.close();}
});

void test('identity, transcript, unread and customer link survive reopening the database',()=>{
 const dir=mkdtempSync(join(tmpdir(),'af-support-test-')),path=join(dir,'test.sqlite');
 let store=createStore(path);
 try{
  const visitor=store.bootstrap(undefined,'website','zh-CN'),c=store.snapshot(visitor.principal).conversations[0];
  const agent=store.agentSession(AGENTS[0].id),clientId=randomUUID();
  const first=store.send(visitor.principal,c.id,'Hello',clientId);
  assert.equal(store.send(visitor.principal,c.id,'Hello',clientId).id,first.id);
  assert.throws(()=>store.send(visitor.principal,c.id,'Modified',clientId),/original message/);
  assert.equal(store.snapshot(agent.principal).conversations[0].agentReadSequence,0);
  store.update(agent.principal,c.id,'read',1);store.update(agent.principal,c.id,'read',0);
  store.update(agent.principal,c.id,'assign',AGENTS[1].id);
  store.update(agent.principal,c.id,'customer',CUSTOMERS[0].userId);
  store.send(agent.principal,c.id,'Hi! How can I help?',randomUUID());
  store.update(agent.principal,c.id,'status','closed');
  store.send(visitor.principal,c.id,'One more question',randomUUID());
  store.close();store=createStore(path);
  const restored=store.bootstrap(visitor.token,'verify','en');
  assert.equal(restored.principal.id,visitor.principal.id);
  const result=store.snapshot(restored.principal);
  assert.equal(result.conversations.length,1);assert.equal(result.conversations[0].id,c.id);
  assert.equal(result.conversations[0].status,'open');assert.equal(result.conversations[0].agentReadSequence,1);
  assert.equal(result.conversations[0].assignedAgentId,AGENTS[1].id);
  assert.equal(result.conversations[0].messages.filter(m=>m.body==='Hello').length,1);
  assert.ok(result.conversations[0].messages.some(m=>m.body==='Hi! How can I help?'));
  assert.equal(result.customers.length,0);assert.equal(result.conversations[0].customer,null);
  const restoredAgent=store.tokenPrincipal('agent',agent.token);
  assert.equal(store.snapshot(restoredAgent).conversations[0].customer?.userId,CUSTOMERS[0].userId);
 }finally{store.close();rmSync(dir,{recursive:true,force:true});}
});
void test('visitor isolation, actor forgery, assignment and read validation',()=>{
 const store=createStore(':memory:');
 try{
  const a=store.bootstrap(undefined,'website','en'),b=store.bootstrap(undefined,'verify','th'),agent=store.agentSession(AGENTS[0].id);
  const bConversation=store.snapshot(b.principal).conversations[0];
  assert.equal(store.snapshot(a.principal).conversations.length,1);
  assert.throws(()=>store.send(a.principal,bConversation.id,'Intrusion',randomUUID()),/not found/);
  assert.throws(()=>store.update(b.principal,bConversation.id,'assign',AGENTS[0].id),/Only a preview agent/);
  assert.throws(()=>store.update(b.principal,bConversation.id,'customer',CUSTOMERS[0].userId),/Only a preview agent/);
  assert.throws(()=>store.tokenPrincipal('agent',a.token),/expired/);
  assert.throws(()=>store.update(agent.principal,bConversation.id,'assign','unknown'),/Invalid agent/);
  assert.throws(()=>store.update(b.principal,bConversation.id,'read',999),/Invalid read/);
  for(let i=0;i<10;i++)assert.equal(store.bootstrap(a.token,'verify','th').principal.id,a.principal.id);
  assert.equal(store.snapshot(agent.principal).conversations.length,2);
 }finally{store.close();}
});
void test('presence is per-tab and typing only reaches the other party',()=>{
 const store=createStore(':memory:');
 try{
  const visitor=store.bootstrap(undefined,'direct','en'),agent=store.agentSession(AGENTS[0].id),c=store.snapshot(visitor.principal).conversations[0];
  store.heartbeat(visitor.principal,'tab-a',c.id,true);
  store.heartbeat(visitor.principal,'tab-b',c.id,false);
  assert.equal(store.snapshot(agent.principal).conversations[0].online,true);
  assert.equal(store.snapshot(agent.principal).conversations[0].typing,true);
  assert.equal(store.snapshot(visitor.principal).conversations[0].typing,false);
  store.heartbeat(visitor.principal,'tab-a',c.id,false,true);
  assert.equal(store.snapshot(agent.principal).conversations[0].online,true);
  assert.equal(store.snapshot(agent.principal).conversations[0].typing,false);
  store.heartbeat(visitor.principal,'tab-b',c.id,false,true);
  assert.equal(store.snapshot(agent.principal).conversations[0].online,false);
 }finally{store.close();}
});
void test('HTTP rejects cross-origin requests, keeps roles isolated, and broadcasts committed changes',async()=>{
 const app=createPreviewServer(':memory:',false);
 await new Promise<void>(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 const address=app.server.address();assert.ok(address&&typeof address!=='string');
 const base='http://127.0.0.1:'+address.port;
 async function call(path:string,body?:unknown,cookie='',origin=base){
  return fetch(base+'/preview-api'+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,Cookie:cookie,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body)});
 }
 const controller=new AbortController();
 try{
  assert.equal((await call('/bootstrap',{},'','https://untrusted.example')).status,403);
  const a=await call('/bootstrap',{source:'website',language:'en'}),cookieA=a.headers.get('set-cookie')!.split(';')[0],snapshot=await a.json() as Snapshot,c=snapshot.conversations[0];
  const b=await call('/bootstrap',{}),cookieB=b.headers.get('set-cookie')!.split(';')[0];
  assert.equal((await call('/snapshot?actor=agent',undefined,cookieA)).status,401);
  assert.equal((await call('/conversations/'+c.id+'/messages',{body:'No access',clientMessageId:randomUUID()},cookieB)).status,404);
  const agent=await call('/agent/session',{}),cookieAgent=agent.headers.get('set-cookie')!.split(';')[0];
  const stream=await fetch(base+'/preview-api/events?actor=agent',{headers:{Cookie:cookieAgent},signal:controller.signal});
  const reader=stream.body!.getReader();await reader.read();
  const id=randomUUID(),responses=await Promise.all(Array.from({length:5},()=>call('/conversations/'+c.id+'/messages',{body:'Hello',clientMessageId:id,senderType:'agent'},cookieA)));
  assert.ok(responses.every(r=>r.status===200));
  const event=await reader.read();assert.ok(new TextDecoder().decode(event.value).includes('event: change'));
  const after=await(await call('/snapshot?actor=agent',undefined,cookieAgent)).json() as Snapshot;
  assert.equal(after.conversations.find(item=>item.id===c.id)!.messages.length,1);
  assert.equal(after.conversations.find(item=>item.id===c.id)!.messages[0].senderType,'visitor');
  await reader.cancel();
  assert.equal((await call('/conversations/'+c.id+'/messages',{body:' '.repeat(2),clientMessageId:randomUUID()},cookieA)).status,400);
 }finally{controller.abort();await app.close();}
});
