import assert from 'node:assert/strict';
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
