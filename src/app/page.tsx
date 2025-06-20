import { KGPTChat } from '@/components/kgpt-chat';

export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen bg-background p-2 sm:p-4">
      <div className="w-full max-w-2xl h-[95vh] sm:h-[90vh] max-h-[800px]">
        <KGPTChat />
      </div>
    </main>
  );
}
