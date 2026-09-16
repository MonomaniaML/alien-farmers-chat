import {headers} from 'next/headers';
import {VisitorTerminal} from '@/components/support/visitor-terminal';
export default async function Home(){const cookie=(await headers()).get('cookie')||'';const initialTheme=/(?:^|;\s*)af_theme=light(?:;|$)/.test(cookie)?'light':'dark';return <VisitorTerminal initialTheme={initialTheme}/>;}
