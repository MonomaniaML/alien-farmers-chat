import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DEFAULT_SETTINGS, PRODUCTS, ORDERS, emptyContext, encodeInteractivePrompt } from '../lib/support/preview-data.ts';
import type { SupportSettings, VisitorContext } from '../lib/support/preview-data.ts';
import type { Actor, Agent, Conversation, Message, PreviewCustomer, Snapshot, Visitor } from '../lib/support/types.ts';

export const AGENTS: Agent[] = [
 { id: '1a000000-0000-4000-8000-000000000001', name: 'Mira' },
 { id: '1a000000-0000-4000-8000-000000000002', name: 'Jonas' },
];
// Isolated illustrative records. Never a copy of the production customer table.
export const CUSTOMERS: PreviewCustomer[] = [
 { userId: '2a000000-0000-4000-8000-000000000001', displayName: 'Alex Morgan', membershipStatus: 'retail', locale: 'en' },
 { userId: '2a000000-0000-4000-8000-000000000002', displayName: '林安', membershipStatus: 'wholesale', locale: 'zh-Hans' },
];
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export class ApiError extends Error { status: number; constructor(status: number, message: string) { super(message); this.status = status; } }
type ConversationRow = Omit<Conversation, 'visitor' | 'customer' | 'messages' | 'online' | 'typing'>;
export type Principal = { actor: Actor; id: string };

export function createStore(file: string) {
 if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
 const db = new DatabaseSync(file);
 db.exec(`
 PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS visitors(id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, customer_user_id TEXT, first_seen_at TEXT NOT NULL, last_seen_at TEXT NOT NULL, language TEXT NOT NULL, source_site TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS conversations(id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL UNIQUE REFERENCES visitors(id), status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')), assigned_agent_id TEXT, last_message_at TEXT NOT NULL, created_at TEXT NOT NULL, closed_at TEXT, agent_read_sequence INTEGER NOT NULL DEFAULT 0, visitor_read_sequence INTEGER NOT NULL DEFAULT 0, sequence INTEGER NOT NULL DEFAULT 0, sample INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS messages(id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL REFERENCES conversations(id), sequence INTEGER NOT NULL, client_message_id TEXT NOT NULL, sender_type TEXT NOT NULL CHECK(sender_type IN ('visitor','agent','system')), actor_id TEXT NOT NULL, agent_id TEXT, body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 4000), created_at TEXT NOT NULL, UNIQUE(conversation_id,sequence), UNIQUE(conversation_id,actor_id,client_message_id));
 CREATE TABLE IF NOT EXISTS agent_sessions(token_hash TEXT PRIMARY KEY, agent_id TEXT NOT NULL, expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS preview_settings(id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS preview_context(visitor_id TEXT PRIMARY KEY REFERENCES visitors(id), data TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
 PRAGMA optimize;
 `);
 const presence = new Map<string, { principal: Principal; conversationId: string | null; typingUntil: number; seen: number }>();
 const visitorSelect = 'id, customer_user_id AS customerUserId, first_seen_at AS firstSeenAt, last_seen_at AS lastSeenAt, language, source_site AS sourceSite';
 const conversationSelect = 'id, visitor_id AS visitorId, status, assigned_agent_id AS assignedAgentId, last_message_at AS lastMessageAt, created_at AS createdAt, closed_at AS closedAt, agent_read_sequence AS agentReadSequence, visitor_read_sequence AS visitorReadSequence, sequence, sample';
 const messageSelect = 'id, conversation_id AS conversationId, sequence, client_message_id AS clientMessageId, sender_type AS senderType, agent_id AS agentId, body, created_at AS createdAt';
 function transaction<T>(work: () => T): T { db.exec('BEGIN IMMEDIATE'); try { const value = work(); db.exec('COMMIT'); return value; } catch (error) { db.exec('ROLLBACK'); throw error; } }
 function visitor(id: string) { return db.prepare(`SELECT ${visitorSelect} FROM visitors WHERE id=?`).get(id) as unknown as Visitor; }
 function row(id: string) { const result = db.prepare(`SELECT ${conversationSelect} FROM conversations WHERE id=?`).get(id) as unknown as ConversationRow | undefined; if (!result) throw new ApiError(404, 'Conversation not found.'); return result; }
 function authorize(principal: Principal, id: string) { const c = row(id); if (principal.actor === 'visitor' && c.visitorId !== principal.id) throw new ApiError(404, 'Conversation not found.'); return c; }
 function tokenPrincipal(actor: Actor, token: string | undefined): Principal {
  if (!token) throw new ApiError(401, 'Your preview session has expired. Reconnect to continue.');
  if (actor === 'visitor') { const item = db.prepare('SELECT id FROM visitors WHERE token_hash=?').get(hash(token)); if (item) return { actor, id: String(item.id) }; }
  else { const item = db.prepare('SELECT agent_id FROM agent_sessions WHERE token_hash=? AND expires_at>?').get(hash(token), Date.now()); if (item) return { actor, id: String(item.agent_id) }; }
  throw new ApiError(401, 'Your preview session has expired. Reconnect to continue.');
 }
 function bootstrap(token: string | undefined, source: string, language: string) {
  if (token) { try { const principal = tokenPrincipal('visitor', token); db.prepare('UPDATE visitors SET last_seen_at=? WHERE id=?').run(new Date().toISOString(), principal.id); return { principal, token }; } catch { /* Expired or removed preview identity. */ } }
  return transaction(() => {
   const id = randomUUID(), newToken = randomBytes(32).toString('base64url'), now = new Date().toISOString();
   db.prepare('INSERT INTO visitors(id,token_hash,first_seen_at,last_seen_at,language,source_site) VALUES(?,?,?,?,?,?)').run(id, hash(newToken), now, now, language.slice(0,24), ['website','verify'].includes(source) ? source : 'direct');
   db.prepare('INSERT INTO conversations(id,visitor_id,last_message_at,created_at) VALUES(?,?,?,?)').run(randomUUID(), id, now, now);
   return { principal: { actor: 'visitor' as const, id }, token: newToken };
  });
 }
 function agentSession(agentId: string) {
  if (!AGENTS.some(agent => agent.id === agentId)) throw new ApiError(400, 'Choose a preview agent.');
  const token = randomBytes(32).toString('base64url');
  db.prepare('DELETE FROM agent_sessions WHERE expires_at<?').run(Date.now());
  db.prepare('INSERT INTO agent_sessions VALUES(?,?,?)').run(hash(token), agentId, Date.now()+86400000);
  return { token, principal: { actor: 'agent' as const, id: agentId } };
 }
 function messages(id: string) { return db.prepare(`SELECT ${messageSelect} FROM messages WHERE conversation_id=? ORDER BY sequence`).all(id) as unknown as Message[]; }
 function insert(id: string, principal: Principal, body: string, clientId: string, system = false) {
  const c = row(id), createdAt = new Date().toISOString();
  db.prepare('INSERT INTO messages VALUES(?,?,?,?,?,?,?,?,?)').run(randomUUID(), id, c.sequence+1, clientId, system ? 'system' : principal.actor, principal.id, principal.actor==='agent' ? principal.id : null, body, createdAt);
  db.prepare('UPDATE conversations SET sequence=sequence+1,last_message_at=? WHERE id=?').run(createdAt,id);
 }
 function send(principal: Principal, id: string, body: string, clientId: string) {
  authorize(principal,id);
  return transaction(() => {
   const existing = db.prepare(`SELECT ${messageSelect} FROM messages WHERE conversation_id=? AND actor_id=? AND client_message_id=?`).get(id,principal.id,clientId) as unknown as Message | undefined;
   if (existing) { if (existing.body!==body) throw new ApiError(409,'This retry does not match the original message.'); return existing; }
   const c = row(id);
   if (c.status==='closed') { db.prepare("UPDATE conversations SET status='open',closed_at=NULL WHERE id=?").run(id); insert(id,principal,'Conversation reopened',randomUUID(),true); }
   insert(id,principal,body,clientId);
   const sent=messages(id).at(-1)!;
   if(principal.actor==='visitor'){
    const config=settings(), locale=context(principal.id).language;
    const normalizedBody=body.toLocaleLowerCase();
    const rule=config.articles.find(article=>article.published&&article.autoReply&&article.keywords.some(keyword=>keyword.trim()&&normalizedBody.includes(keyword.trim().toLocaleLowerCase())));
    const first=messages(id).filter(m=>m.senderType==='visitor').length===1;
    const online=[...presence.values()].some(p=>p.principal.actor==='agent'&&Date.now()-p.seen<35000);
    const lastAway=db.prepare("SELECT created_at FROM messages WHERE conversation_id=? AND actor_id='preview-automation' AND client_message_id LIKE 'auto-away:%' ORDER BY sequence DESC LIMIT 1").get(id);
    if(rule){
     let answer=rule.body;
     if(rule.responseType==='options'&&rule.options.length)answer=encodeInteractivePrompt({question:rule.body,options:rule.options.filter(Boolean).map(label=>({label,value:label}))});
     if(rule.responseType==='order_lookup'){
      const member=context(principal.id).member;
      if(!member)answer=encodeInteractivePrompt({question:'请先登录会员账号，我才能安全地查询你的订单。',options:[{label:'我先登录',value:'我登录后再查询订单'}]});
      else if(ORDERS.length===1){const order=ORDERS[0];answer=encodeInteractivePrompt({question:'我查到这个订单，请确认是否要查询它的发货进度？',options:[{label:order.id,value:'[af-order:'+order.id+']',detail:order.placedAt+' · '+order.status}]});}
      else answer=encodeInteractivePrompt({question:'我查到你有多个订单，请选择要查询发货进度的订单：',options:ORDERS.map(order=>({label:order.id,value:'[af-order:'+order.id+']',detail:order.placedAt+' · '+order.status}))});
     }
     if(answer.trim())insert(id,{actor:'agent',id:'preview-automation'},answer,'auto-knowledge:'+rule.id+':'+randomUUID());
    }else{
     const kind=first&&config.welcome.enabled?'welcome':!online&&config.away.enabled&&(!lastAway||Date.now()-Date.parse(String(lastAway.created_at))>900000)?'away':null;
     if(kind){const answer=config[kind].bodies[locale]||config[kind].bodies.en;if(answer.trim())insert(id,{actor:'agent',id:'preview-automation'},answer,'auto-'+kind+':'+randomUUID());}
    }
   }
   return sent;
  });
 }
 function update(principal: Principal, id: string, action: string, value: unknown) {
  authorize(principal,id);
  if (action==='read') {
   if (typeof value!=='number' || !Number.isInteger(value) || value<0 || value>row(id).sequence) throw new ApiError(400,'Invalid read position.');
   const column = principal.actor==='agent' ? 'agent_read_sequence' : 'visitor_read_sequence';
   return Number(db.prepare(`UPDATE conversations SET ${column}=? WHERE id=? AND ${column}<?`).run(value,id,value).changes)>0;
  }
  if (principal.actor!=='agent') throw new ApiError(403,'Only a preview agent can do this.');
  return transaction(() => {
   const c=row(id), name=AGENTS.find(a=>a.id===principal.id)!.name;
   if (action==='status') {
    if (value!=='open' && value!=='closed') throw new ApiError(400,'Invalid status.');
    if (c.status===value) return false;
    db.prepare('UPDATE conversations SET status=?,closed_at=? WHERE id=?').run(value,value==='closed'?new Date().toISOString():null,id);
    insert(id,principal,`${name} ${value==='closed'?'closed':'reopened'} the conversation`,randomUUID(),true);
   } else if (action==='assign') {
    if (value!==null && !AGENTS.some(a=>a.id===value)) throw new ApiError(400,'Invalid agent.');
    if(c.assignedAgentId===value) return false;
    db.prepare('UPDATE conversations SET assigned_agent_id=? WHERE id=?').run(value as string|null,id);
    insert(id,principal,value ? `Assigned to ${AGENTS.find(a=>a.id===value)!.name}` : 'Assignment removed',randomUUID(),true);
   } else if(action==='customer') {
    if(value!==null && !CUSTOMERS.some(customer=>customer.userId===value)) throw new ApiError(400,'Choose a sample customer.');
    if(visitor(c.visitorId).customerUserId===value) return false;
    db.prepare('UPDATE visitors SET customer_user_id=? WHERE id=?').run(value as string|null,c.visitorId);
    insert(id,principal,value ? 'Sample customer linked by '+name : 'Sample customer unlinked by '+name,randomUUID(),true);
   } else throw new ApiError(400,'Unknown action.');
   return true;
  });
 }
 function heartbeat(principal: Principal, tabId: string, conversationId: string|null, typing: boolean, leave=false) {
  if(conversationId) authorize(principal,conversationId);
  const key=principal.actor+':'+principal.id+':'+tabId, now=Date.now();
  if(leave) presence.delete(key);
  else presence.set(key,{principal,conversationId,typingUntil:typing?now+5000:0,seen:now});
  for(const [k,p] of presence) if(now-p.seen>35000) presence.delete(k);
  if(principal.actor==='visitor') db.prepare('UPDATE visitors SET last_seen_at=? WHERE id=?').run(new Date(now).toISOString(),principal.id);
 }
 function snapshot(principal: Principal): Snapshot {
  const now=Date.now(), peers=[...presence.values()].filter(p=>now-p.seen<35000);
  const rows=db.prepare(`SELECT ${conversationSelect} FROM conversations ${principal.actor==='visitor'?'WHERE visitor_id=?':''} ORDER BY last_message_at DESC,id`).all(...(principal.actor==='visitor'?[principal.id]:[])) as unknown as ConversationRow[];
  return {actor:principal.actor,actorId:principal.id,preview:true,agents:AGENTS,customers:principal.actor==='agent'?CUSTOMERS:[],supportOnline:peers.some(p=>p.principal.actor==='agent'),...(principal.actor==='agent'?{settings:settings()}:{}),
   conversations:rows.map(c=>({...c,sample:Boolean(c.sample),visitor:principal.actor==='agent'?visitor(c.visitorId):{...visitor(c.visitorId),customerUserId:null},customer:principal.actor==='agent'?CUSTOMERS.find(customer=>customer.userId===visitor(c.visitorId).customerUserId)||null:null,messages:messages(c.id),
    context:context(c.visitorId),online:peers.some(p=>p.principal.actor==='visitor'&&p.principal.id===c.visitorId),
    typing:peers.some(p=>p.principal.actor!==principal.actor&&p.conversationId===c.id&&p.typingUntil>now)
   }))};
 }
 function seed() {
  if(db.prepare('SELECT id FROM conversations WHERE sample=1 LIMIT 1').get())return;
  const samples=[
   {name:'Order update',body:'Hi! Could you help me check the status of my order?',customer:CUSTOMERS[0].userId,assigned:AGENTS[0].id},
   {name:'Product question',body:'你好，请问在哪里可以查看产品的验证信息？',customer:CUSTOMERS[1].userId,assigned:null},
   {name:'Getting started',body:'Thanks for your help. That answers my question!',customer:null,assigned:AGENTS[1].id},
  ];
  for(const [i,sample]of samples.entries()){
   const v=bootstrap(undefined,'website',i===1?'zh-Hans':'en'),id=snapshot(v.principal).conversations[0].id;
   send(v.principal,id,sample.body,randomUUID());
   db.prepare('UPDATE visitors SET customer_user_id=? WHERE id=?').run(sample.customer,v.principal.id);
   db.prepare('UPDATE conversations SET sample=1,assigned_agent_id=?,last_message_at=? WHERE id=?').run(sample.assigned,new Date(Date.now()-(i+1)*480000).toISOString(),id);
   if(i===2){send({actor:'agent',id:AGENTS[1].id},id,'You’re welcome! We’re here whenever you need us.',randomUUID());update({actor:'agent',id:AGENTS[1].id},id,'status','closed');}
  }
 }
 function context(id:string):VisitorContext {const record=db.prepare('SELECT data FROM preview_context WHERE visitor_id=?').get(id);return record?JSON.parse(String(record.data)) as VisitorContext:{...emptyContext};}
 function setContext(principal:Principal,value:Record<string,unknown>){
  if(principal.actor!=='visitor')throw new ApiError(403,'Visitor session required.');
  const next=context(principal.id);
  if('member' in value){if(typeof value.member!=='boolean')throw new ApiError(400,'Invalid member.');next.member=value.member;}
  if('productId' in value){if(value.productId!==null&&!PRODUCTS.some(p=>p.id===value.productId))throw new ApiError(400,'Unknown preview product.');next.productId=value.productId as string|null;next.sourcePage=next.productId?'/products/'+next.productId:'';}
  if('language' in value){if(!['en','th','zh-CN','zh-TW','ru'].includes(String(value.language)))throw new ApiError(400,'Invalid language.');next.language=value.language as VisitorContext['language'];}
  transaction(()=>{db.prepare('INSERT INTO preview_context VALUES(?,?) ON CONFLICT(visitor_id) DO UPDATE SET data=excluded.data').run(principal.id,JSON.stringify(next));if('member' in value)db.prepare('UPDATE visitors SET customer_user_id=? WHERE id=?').run(next.member?CUSTOMERS[0].userId:null,principal.id);});
  return next;
 }
 function settings():SupportSettings {
  const record=db.prepare('SELECT data FROM preview_settings WHERE id=1').get();
  if(!record)return structuredClone(DEFAULT_SETTINGS);
  const saved=JSON.parse(String(record.data)) as SupportSettings;
  saved.articles=(saved.articles||[]).map(article=>({...article,keywords:Array.isArray(article.keywords)?article.keywords:[],autoReply:article.autoReply===true,responseType:article.responseType||'answer',options:Array.isArray(article.options)?article.options:[]}));
  const shipping=DEFAULT_SETTINGS.articles.find(article=>article.id==='shipping');if(shipping&&!saved.articles.some(article=>article.id==='shipping'))saved.articles.unshift(structuredClone(shipping));
  return saved;
 }
 function saveSettings(principal:Principal,value:unknown){
  if(principal.actor!=='agent')throw new ApiError(403,'Only a preview agent can do this.');
  const validText=(v:unknown,max=4000)=>typeof v==='string'&&v.length<=max;
  const bodies=(v:unknown)=>!!v&&typeof v==='object'&&['en','th','zh-CN','zh-TW','ru'].every(k=>validText((v as Record<string,unknown>)[k]));
  if(!value||typeof value!=='object')throw new ApiError(400,'Invalid settings.');
  const v=value as SupportSettings;
  if(!Array.isArray(v.quickReplies)||v.quickReplies.length>40||!Array.isArray(v.articles)||v.articles.length>40||!v.quickReplies.every(r=>r&&validText(r.id,100)&&validText(r.title,150)&&bodies(r.bodies))||!v.articles.every(a=>a&&validText(a.id,100)&&validText(a.title,150)&&validText(a.body)&&typeof a.published==='boolean'&&Array.isArray(a.keywords)&&a.keywords.length<=30&&a.keywords.every(k=>validText(k,80))&&typeof a.autoReply==='boolean'&&['answer','options','order_lookup'].includes(a.responseType)&&Array.isArray(a.options)&&a.options.length<=10&&a.options.every(option=>validText(option,200)))||![v.welcome,v.away].every(r=>r&&typeof r.enabled==='boolean'&&bodies(r.bodies)))throw new ApiError(400,'Invalid settings.');
  const next:SupportSettings={quickReplies:v.quickReplies.map(r=>({id:r.id,title:r.title,bodies:r.bodies})),articles:v.articles.map(a=>({id:a.id,title:a.title,body:a.body,published:a.published,keywords:a.keywords.map(k=>k.trim()).filter(Boolean),autoReply:a.autoReply,responseType:a.responseType,options:a.options.map(option=>option.trim()).filter(Boolean)})),welcome:v.welcome,away:v.away};
  db.prepare('INSERT INTO preview_settings VALUES(1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(JSON.stringify(next));return next;
 }
 return { db, bootstrap, agentSession, tokenPrincipal, authorize, send, update, heartbeat, snapshot, seed, context, setContext, settings, saveSettings, close:()=>db.close() };
}
