import { NextRequest, NextResponse } from 'next/server';
import { identityIssuer, postLogoutUri, sessionCookie } from '@/lib/identity/session';
function logout(request: NextRequest) { const target = new URL(`${identityIssuer()}/session/end`); target.search = new URLSearchParams({ client_id: 'chat', post_logout_redirect_uri: postLogoutUri(request) }).toString(); const response = NextResponse.redirect(target, 303); response.headers.set('Cache-Control', 'no-store'); response.headers.append('Set-Cookie', sessionCookie('', request, 0)); return response; }
export const GET = logout; export const POST = logout;
