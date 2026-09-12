import 'server-only';

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const APP_SESSION_COOKIE = 'af_chat_session';
export const OIDC_TRANSACTION_COOKIE = 'af_chat_oidc_transaction';
const developmentSecret = randomBytes(32).toString('base64url');
const MEMBER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
type AppSession = { v: 1; sub: string; email: string; client: 'chat'; iat: number; exp: number };
type OidcTransaction = { v: 1; state: string; nonce: string; verifier: string; client: 'chat'; redirectUri: string; returnTo: string; exp: number };

function secret() {
  const value = process.env.CHAT_SESSION_SECRET?.trim();
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV === 'production') throw new Error('CHAT_SESSION_SECRET must contain at least 32 characters.');
  return developmentSecret;
}
function safeEqual(left: string, right: string) { const a = Buffer.from(left), b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }
function encode(value: object) { const payload = Buffer.from(JSON.stringify(value)).toString('base64url'); return `${payload}.${createHmac('sha256', secret()).update(payload).digest('base64url')}`; }
function decode<T>(value: string): T | null { const [payload, signature] = value.split('.'); if (!payload || !signature) return null; const expected = createHmac('sha256', secret()).update(payload).digest('base64url'); if (!safeEqual(signature, expected)) return null; try { return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T; } catch { return null; } }

export function identityIssuer() { return (process.env.IDENTITY_ISSUER || (process.env.NODE_ENV === 'production' ? 'https://auth.alienfarmers.org' : 'http://localhost:3050')).replace(/\/+$/u, ''); }
export function callbackUri(request: Request) { const url = new URL(request.url); const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || url.protocol.replace(':', ''); const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() || url.host; return `${protocol}://${host}/auth/callback`; }
export function postLogoutUri(request: Request) { return new URL('/', callbackUri(request)).toString(); }
export function safeReturnTo(value: string) { return value.startsWith('/') && !value.startsWith('//') ? value.slice(0, 500) : '/'; }
export function createOidcTransaction(request: Request, returnTo: string) { const verifier = randomBytes(48).toString('base64url'); const transaction: OidcTransaction = { v: 1, state: randomBytes(24).toString('base64url'), nonce: randomBytes(24).toString('base64url'), verifier, client: 'chat', redirectUri: callbackUri(request), returnTo: safeReturnTo(returnTo), exp: Math.floor(Date.now() / 1000) + 600 }; return { transaction, encoded: encode(transaction), challenge: createHash('sha256').update(verifier).digest('base64url') }; }
export function readOidcTransaction(request: Request) { const transaction = decode<OidcTransaction>(cookieValue(request, OIDC_TRANSACTION_COOKIE)); return transaction?.v === 1 && transaction.client === 'chat' && transaction.exp > Date.now() / 1000 && transaction.redirectUri === callbackUri(request) ? transaction : null; }
export function createAppSession(memberId: string, email: string) { const now = Math.floor(Date.now() / 1000); return encode({ v: 1, sub: memberId, email: email.trim().toLowerCase(), client: 'chat', iat: now, exp: now + 12 * 60 * 60 } satisfies AppSession); }
export function readAppSession(request: Request): AppSession | null { const value = decode<AppSession>(cookieValue(request, APP_SESSION_COOKIE)), now = Date.now() / 1000; return value?.v === 1 && value.client === 'chat' && value.exp > now && value.iat <= now + 15 && MEMBER_ID.test(value.sub) && value.email.length <= 254 && value.email.includes('@') ? value : null; }
export function createMemberAssertion(session: AppSession) { const value = process.env.CHAT_MEMBER_SERVICE_TOKEN?.trim(); if (!value || value.length < 32) return null; const now = Math.floor(Date.now() / 1000); const payload = Buffer.from(JSON.stringify({ v: 1, iss: 'chat', aud: 'flower-database', sub: session.sub, email: session.email, iat: now, exp: now + 45 })).toString('base64url'); return `${payload}.${createHmac('sha256', value).update(payload).digest('base64url')}`; }
export function cookieValue(request: Request, name: string) { const item = (request.headers.get('cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`)); return item ? decodeURIComponent(item.slice(name.length + 1)) : ''; }
export function secureCookie(request: Request) { return process.env.NODE_ENV === 'production' || callbackUri(request).startsWith('https://'); }
export function sessionCookie(value: string, request: Request, maxAge: number) { return `${APP_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureCookie(request) ? '; Secure' : ''}`; }
export function transactionCookie(value: string, request: Request, maxAge: number) { return `${OIDC_TRANSACTION_COOKIE}=${encodeURIComponent(value)}; Path=/auth; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureCookie(request) ? '; Secure' : ''}`; }
export function equalState(left: string, right: string) { return safeEqual(left, right); }
