import {
  isAllowedMemberProxyRequest,
  isSameOriginMutation,
  sharedMemberCookie,
} from '@/lib/member-navigation';
import { createMemberAssertion, readAppSession } from '@/lib/identity/session';

const memberApi = 'https://api.alienfarmers.org/api/member';

export const dynamic = 'force-dynamic';

async function proxyMember(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    if (!isAllowedMemberProxyRequest(path, request.method)) {
      return Response.json({ error: { message: 'Member route not found' } }, { status: 404 });
    }
    if (request.method === 'POST' && !isSameOriginMutation(request)) {
      return Response.json({ error: { message: 'Cross-site request rejected' } }, { status: 403 });
    }

    const incoming = new URL(request.url);
    const upstream = new URL(`${memberApi}/${path[0]}`);
    if (request.method === 'GET') {
      incoming.searchParams.forEach((value, key) => upstream.searchParams.append(key, value));
    }
    const headers = new Headers({ Accept: 'application/json' });
    const contentType = request.headers.get('content-type');
    const cookie = request.headers.get('cookie');
    if (contentType) headers.set('Content-Type', contentType);
    if (cookie) headers.set('Cookie', cookie);
    const appSession = readAppSession(request);
    const assertion = appSession ? createMemberAssertion(appSession) : null;
    if (assertion) headers.set('X-AF-Member-Assertion', assertion);

    const response = await fetch(upstream, {
      method: request.method,
      headers,
      body: request.method === 'GET' ? undefined : await request.text(),
      cache: 'no-store',
      redirect: 'manual',
    });
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('content-type') || 'application/json',
      'Cache-Control': 'no-store',
    });
    const cookies =
      typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : response.headers.get('set-cookie')
          ? [response.headers.get('set-cookie') as string]
          : [];
    for (const value of cookies) {
      responseHeaders.append('Set-Cookie', sharedMemberCookie(value, incoming.hostname));
    }
    return new Response(await response.text(), { status: response.status, headers: responseHeaders });
  } catch {
    return Response.json(
      { error: { message: 'Member service is temporarily unavailable' } },
      { status: 502 },
    );
  }
}

export const GET = proxyMember;
export const POST = proxyMember;
