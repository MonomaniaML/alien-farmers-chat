import type { Metadata } from 'next';
import './globals.css';
import './redesign.css';
export const metadata: Metadata = { title: 'Conversations · Alien Farmers', description: 'ALIEN FARMERS assistants, delivery help, support, feedback and wholesale conversations.', robots: { index: false, follow: false }, icons: { icon: '/alien-farmers-planet-icon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="dark"><body>{children}</body></html>; }
