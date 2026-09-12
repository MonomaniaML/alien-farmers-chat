export const ageVerificationCookie = 'af_age_verified';
export const ageVerificationStorageKey = 'alien-farmers-age-verified-v1';
export function hasAgeVerification(cookieHeader: string | null) { return cookieHeader?.split(';').some(entry => { const [name, value] = entry.trim().split('=', 2); return name === ageVerificationCookie && value === 'yes'; }) ?? false; }
