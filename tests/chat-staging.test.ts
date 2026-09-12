import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

void test('Chat platform links select exact staging origins', async () => {
  const environment = await read('lib/platform-environment.ts');
  assert.match(environment, /NEXT_PUBLIC_PLATFORM_ENV === 'staging'/);
  assert.match(environment, /website: `https:\/\/\$\{platformRoot\}`/);
  assert.match(environment, /member: `https:\/\/member\.\$\{platformRoot\}`/);
  assert.match(environment, /support: `https:\/\/chat\.\$\{platformRoot\}`/);
});

void test('age and legacy member cookies use the staging parent before production matching', async () => {
  const [environment, gate] = await Promise.all([read('lib/platform-environment.ts'), read('components/age-gate.tsx')]);
  assert.match(environment, /hostname\.endsWith\('\.staging\.alienfarmers\.org'\)[\s\S]+return '\.staging\.alienfarmers\.org'/);
  assert.match(environment, /hostname\.endsWith\('\.alienfarmers\.org'\)[\s\S]+return '\.alienfarmers\.org'/);
  assert.match(gate, /sharedCookieDomain\(location\.hostname\)/);
  assert.doesNotMatch(gate, /Domain=\.alienfarmers\.org/);
});

void test('member API, Staff and Identity endpoints remain server-configurable', async () => {
  const [proxy, staff, identity] = await Promise.all([
    read('app/api/member/[...path]/route.ts'),
    read('lib/support/staff-origin.ts'),
    read('lib/identity/session.ts'),
  ]);
  assert.match(proxy, /DATABASE_API_ORIGIN/);
  assert.match(staff, /STAFF_APP_ORIGIN/);
  assert.match(identity, /IDENTITY_ISSUER/);
});
