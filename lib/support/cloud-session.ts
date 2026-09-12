import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { createMemberAssertion, readAppSession, secureCookie } from '@/lib/identity/session';

export const CHAT_VISITOR_COOKIE='af_chat_visitor';
function secret(){const value=process.env.CHAT_SESSION_SECRET?.trim();if(value&&value.length>=32)return value;if(process.env.NODE_ENV==='production')throw new Error('CHAT_SESSION_SECRET must contain at least 32 characters.');return 'local-chat-visitor-secret-change-before-production';}
function sign(id:string){return `${id}.${createHmac('sha256',secret()).update(id).digest('base64url')}`;}
function readCookie(request:Request,name:string){const part=(request.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='));return part?decodeURIComponent(part.slice(name.length+1)):'';}
function valid(value:string){const [id,signature]=value.split('.');if(!id||!signature||!/^[0-9a-f]{8}-[0-9a-f-]{27}$/iu.test(id))return null;const expected=createHmac('sha256',secret()).update(id).digest('base64url'),a=Buffer.from(signature),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)?id:null;}
export function chatVisitor(request:Request){const existing=valid(readCookie(request,CHAT_VISITOR_COOKIE));if(existing)return{id:existing,cookie:null};const id=randomUUID();return{id,cookie:sign(id)};}
export function visitorCookie(value:string,request:Request){return `${CHAT_VISITOR_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secureCookie(request)?'; Secure':''}`;}
export function databaseOrigin(){return(process.env.DATABASE_API_ORIGIN||'https://api.alienfarmers.org').replace(/\/+$/u,'');}
export function integrationHeaders(request:Request,visitorId:string){const service=process.env.CHAT_SERVICE_TOKEN?.trim();if(!service||service.length<32)throw new Error('CHAT_SERVICE_TOKEN is unavailable.');const headers=new Headers({'Content-Type':'application/json','X-AF-Chat-Service':service,'X-AF-Chat-Visitor':visitorId});const session=readAppSession(request),assertion=session?createMemberAssertion(session):null;if(assertion)headers.set('X-AF-Member-Assertion',assertion);return headers;}
export function isSameOrigin(request:Request){if(request.headers.get('sec-fetch-site')==='cross-site')return false;const origin=request.headers.get('origin');try{return !origin||new URL(origin).host===new URL(request.url).host;}catch{return false;}}
