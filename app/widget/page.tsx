import type { Metadata } from 'next';
import { FloatingChat } from '@/components/assistant-chat/floating-chat';

export const metadata: Metadata = {
  title: 'Chat · ALIEN FARMERS',
  description: 'ALIEN FARMERS floating customer chat.',
  robots: { index: false, follow: false },
};

export default function WidgetPage() {
  return (
    <main className="af-floating-page">
      <FloatingChat />
    </main>
  );
}
