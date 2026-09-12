import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

void test('Chat uses its own OIDC application session with state, nonce and S256 PKCE', async () => {
  const [session, login, callback] = await Promise.all([read('lib/identity/session.ts'), read('app/auth/login/route.ts'), read('app/auth/callback/route.ts')]);
  assert.match(session, /APP_SESSION_COOKIE = 'af_chat_session'/);
  assert.doesNotMatch(session, /Domain=/);
  assert.match(session, /CHAT_SESSION_SECRET/);
  assert.match(login, /client_id: 'chat'/);
  assert.match(login, /code_challenge_method: 'S256'/);
  assert.match(callback, /equalState\(state, transaction\.state\)/);
  assert.match(callback, /code_verifier: transaction\.verifier/);
});

void test('Chat member proxy sends a short audience-bound assertion and keeps legacy Cookie fallback', async () => {
  const proxy = await read('app/api/member/[...path]/route.ts');
  assert.match(proxy, /X-AF-Member-Assertion/);
  assert.match(proxy, /if \(cookie\) headers\.set\('Cookie', cookie\)/);
});

void test('Chat uses the common age confirmation independently from member login', async () => {
  const [gate, layout] = await Promise.all([read('components/age-gate.tsx'), read('app/layout.tsx')]);
  assert.match(gate, /af_age_verified|ageVerificationCookie/);
  assert.match(gate, /Max-Age=31536000/);
  assert.doesNotMatch(gate, /MemberProfile|memberRequest|readAppSession/);
  assert.match(layout, /<AgeGate/);
});
