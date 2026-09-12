import type { Metadata } from 'next';
import './globals.css';
import './redesign.css';
import './age-gate.css';
import { headers } from 'next/headers';
import { AgeGate } from '@/components/age-gate';
import { hasAgeVerification } from '@/lib/age-verification';
export const metadata: Metadata = { title: 'Conversations · Alien Farmers', description: 'ALIEN FARMERS assistants, delivery help, support, feedback and wholesale conversations.', robots: { index: false, follow: false }, icons: { icon: '/alien-farmers-planet-icon.svg' } };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const requestHeaders = await headers(); const host = requestHeaders.get('x-forwarded-host')?.split(',')[0]?.trim() || requestHeaders.get('host') || ''; const bypass = host.split(':')[0].toLowerCase() === 'ops.alienfarmers.org'; return <html lang="en" className="dark"><body><AgeGate initiallyVerified={hasAgeVerification(requestHeaders.get('cookie'))} bypass={bypass}>{children}</AgeGate></body></html>; }
