import { NextRequest, NextResponse } from 'next/server';
import { createOidcTransaction, identityIssuer, readAppSession, safeReturnTo, transactionCookie } from '@/lib/identity/session';
export async function GET(request: NextRequest) {
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get('returnTo') || '/');
  if (readAppSession(request)) {
    const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }
  const { transaction, encoded, challenge } = createOidcTransaction(request, returnTo);
  const authorize = new URL(`${identityIssuer()}/auth`);
  authorize.search = new URLSearchParams({ client_id: 'chat', redirect_uri: transaction.redirectUri, response_type: 'code', scope: 'openid profile email member:summary chat:read chat:write', state: transaction.state, nonce: transaction.nonce, code_challenge: challenge, code_challenge_method: 'S256' }).toString();
  if (request.nextUrl.searchParams.get('prompt') === 'none') authorize.searchParams.set('prompt', 'none');
  const response = NextResponse.redirect(authorize, 303);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.append('Set-Cookie', transactionCookie(encoded, request, 600));
  return response;
}
