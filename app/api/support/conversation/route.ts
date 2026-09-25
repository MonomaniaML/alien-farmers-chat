import { NextResponse } from 'next/server';
import { chatVisitor, databaseOrigin, integrationHeaders, isSameOrigin, visitorCookie } from '@/lib/support/cloud-session';

export const dynamic = 'force-dynamic';

async function conversation(request: Request, createIfMissing: boolean) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: { message: 'Cross-site requests are not allowed.' } }, { status: 403 });
  try {
    const visitor = chatVisitor(request);
    const input: Record<string, unknown> = createIfMissing ? await request.json().catch(() => ({})) : {};
    const params = new URL(request.url).searchParams;
    const channel = createIfMissing ? input.channel : params.get('channel');
    const locale = createIfMissing ? input.locale : params.get('locale');
    const response = await fetch(`${databaseOrigin()}/api/integrations/chat/conversation`, {
      method: 'POST',
      headers: integrationHeaders(request, visitor.id),
      body: JSON.stringify({ locale: locale || 'en', sourceSite: 'chat', channel: channel || 'human_support', createIfMissing }),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({ error: { message: 'Support is temporarily unavailable.' } }));
    const out = NextResponse.json(payload, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
    if (visitor.cookie) out.headers.append('Set-Cookie', visitorCookie(visitor.cookie, request));
    return out;
  } catch (error) {
    console.error('Chat conversation bootstrap failed:', error);
    return NextResponse.json({ error: { message: 'Support is temporarily unavailable.' } }, { status: 503 });
  }
}

export async function GET(request: Request) { return conversation(request, false); }
export async function POST(request: Request) { return conversation(request, true); }
