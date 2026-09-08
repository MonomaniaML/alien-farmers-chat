import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  isAllowedMemberProxyRequest,
  isSameOriginMutation,
  sharedMemberCookie,
} from '../lib/member-navigation.ts';

void test('member proxy exposes only the navigation authentication surface', () => {
  assert.equal(isAllowedMemberProxyRequest(['session'], 'GET'), true);
  assert.equal(isAllowedMemberProxyRequest(['orders'], 'GET'), true);
  assert.equal(isAllowedMemberProxyRequest(['notifications'], 'GET'), true);
  assert.equal(isAllowedMemberProxyRequest(['login'], 'POST'), true);
  assert.equal(isAllowedMemberProxyRequest(['register'], 'POST'), true);
  assert.equal(isAllowedMemberProxyRequest(['logout'], 'POST'), true);
  assert.equal(isAllowedMemberProxyRequest(['profile'], 'GET'), false);
  assert.equal(isAllowedMemberProxyRequest(['session'], 'POST'), false);
  assert.equal(isAllowedMemberProxyRequest(['login', 'anything'], 'POST'), false);
});

void test('member cookies are shared only across official production subdomains', () => {
  const cookie = 'af_member_access=token; Path=/; HttpOnly; Secure; SameSite=Lax';
  assert.match(sharedMemberCookie(cookie, 'chat.alienfarmers.org'), /Domain=\.alienfarmers\.org$/);
  assert.doesNotMatch(sharedMemberCookie(cookie, 'localhost'), /Secure|Domain=/);
  assert.doesNotMatch(sharedMemberCookie(cookie, 'preview.example'), /Domain=/);
});

void test('state-changing browser requests must be same-origin', () => {
  assert.equal(isSameOriginMutation(new Request('https://chat.alienfarmers.org/api/member/login', { headers: { origin: 'https://chat.alienfarmers.org', 'sec-fetch-site': 'same-origin' } })), true);
  assert.equal(isSameOriginMutation(new Request('https://chat.alienfarmers.org/api/member/login', { headers: { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' } })), false);
});

void test('customer chat uses the shared member language cookie and locale aliases', async () => {
  const [i18n, visitor] = await Promise.all([
    readFile(new URL('../lib/support/i18n.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/support/visitor-terminal.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(i18n, /sharedLocaleCookie='af_locale'/);
  assert.match(i18n, /Domain=\.alienfarmers\.org/);
  assert.match(i18n, /zh-Hans/);
  assert.match(i18n, /zh-Hant/);
  assert.match(visitor, /memberLocale\(next\.preferredLocale\)/);
});

void test('registration presents date of birth as guided year, month and day segments', async () => {
  const source = await readFile(new URL('../components/member-profile-navigation.tsx', import.meta.url), 'utf8');
  assert.match(source, /className="member-birth-segments"/);
  for (const placeholder of ['YYYY', 'MM', 'DD']) assert.match(source, new RegExp(`placeholder="${placeholder}"`));
  assert.match(source, /name="dateOfBirth" type="hidden"/);
  assert.match(source, /isValidBirthDate/);
});
