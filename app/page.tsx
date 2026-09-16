import {headers} from 'next/headers';
import {SupportPage} from '@/components/support/support-page';
export default async function Home(){const cookie=(await headers()).get('cookie')||'';const initialTheme=/(?:^|;\s*)af_theme=light(?:;|$)/.test(cookie)?'light':'dark';return <SupportPage initialTheme={initialTheme}/>;}
