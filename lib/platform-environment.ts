export type PlatformService = 'website' | 'member' | 'verify' | 'drop' | 'social' | 'support';

const staging = process.env.NEXT_PUBLIC_PLATFORM_ENV === 'staging';
const platformRoot = staging ? 'staging.alienfarmers.org' : 'alienfarmers.org';

export const platformOrigins: Record<PlatformService, string> = {
  website: `https://${platformRoot}`,
  member: `https://member.${platformRoot}`,
  verify: `https://verify.${platformRoot}`,
  drop: `https://drop.${platformRoot}`,
  social: `https://social.${platformRoot}`,
  support: `https://chat.${platformRoot}`,
};

export function sharedCookieDomain(hostname: string) {
  if (hostname === 'staging.alienfarmers.org' || hostname.endsWith('.staging.alienfarmers.org')) {
    return '.staging.alienfarmers.org';
  }
  if (hostname === 'alienfarmers.org' || hostname.endsWith('.alienfarmers.org')) {
    return '.alienfarmers.org';
  }
  return '';
}
