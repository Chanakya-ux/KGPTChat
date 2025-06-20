
import { KGPTChat } from '@/components/kgpt-chat/index'; // Explicitly point to the index file in the directory

export default function Home() {
  return (
    <main
      className="flex justify-center items-center bg-gradient-to-br from-background to-secondary"
      style={{ minHeight: 'calc(var(--app-height, 100dvh))' }}
    >
      <div className="w-full" style={{ height: 'calc(var(--app-height, 100dvh))' }}>
        <KGPTChat />
      </div>
    </main>
  );
}
