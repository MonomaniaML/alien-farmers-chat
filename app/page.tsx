import { headers } from 'next/headers';
import { OpsInbox } from '@/components/support/ops-inbox';
import { VisitorTerminal } from '@/components/support/visitor-terminal';

export default async function Home() {
  const host = (await headers()).get('host')?.split(':')[0].toLowerCase();
  return host === 'ops.alienfarmers.org' ? <OpsInbox /> : <VisitorTerminal />;
}
