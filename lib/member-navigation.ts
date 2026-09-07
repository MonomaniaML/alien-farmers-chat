export type MemberProfile = {
  userId: string;
  email: string;
  displayName: string;
  preferredLocale?: string | null;
  membershipStatus?: string | null;
  avatarUrl?: string | null;
};

const allowedMemberRoutes: Record<string, ReadonlySet<string>> = {
  session: new Set(['GET']),
  login: new Set(['POST']),
  register: new Set(['POST']),
  logout: new Set(['POST']),
};

export function isAllowedMemberProxyRequest(path: string[], method: string) {
  return path.length === 1 && Boolean(allowedMemberRoutes[path[0]]?.has(method.toUpperCase()));
}

export function sharedMemberCookie(value: string, hostname: string) {
  const withoutDomain = value.replace(/;\s*Domain=[^;]+/gi, '');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') {
    return withoutDomain.replace(/;\s*Secure/gi, '').replace(/SameSite=None/gi, 'SameSite=Lax');
  }
  if (hostname === 'alienfarmers.org' || hostname.endsWith('.alienfarmers.org')) {
    return `${withoutDomain}; Domain=.alienfarmers.org`;
  }
  return withoutDomain;
}

export function isSameOriginMutation(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') return false;
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
