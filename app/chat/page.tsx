import {headers} from 'next/headers';
import {VisitorTerminal} from '@/components/support/visitor-terminal';
export default async function Chat(){const cookie=(await headers()).get('cookie')||'';return <VisitorTerminal initialTheme={/(?:^|;\s*)af_theme=light(?:;|$)/.test(cookie)?'light':'dark'} initialAssistant="customer-support"/>;}
