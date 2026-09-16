import {headers} from 'next/headers';
import {SupportPage} from '@/components/support/support-page';
export default async function Tickets(){const cookie=(await headers()).get('cookie')||'';return <SupportPage tickets initialTheme={/(?:^|;\s*)af_theme=light(?:;|$)/.test(cookie)?'light':'dark'}/>;}
