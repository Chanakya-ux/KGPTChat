
import { KGPTChat } from '@/components/kgpt-chat/index'; // Explicitly point to the index file in the directory

export default function Home() {
  return (
    // Updated styling for overall page to use theme variables
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background to-secondary p-2 sm:p-4">
      <div className="w-full max-w-3xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[900px]">
        <KGPTChat />
      </div>
    </main>
  );
}
