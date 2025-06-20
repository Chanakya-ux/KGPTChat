
import { KGPTChat } from '@/components/kgpt-chat/index'; // Explicitly point to the index file in the directory

export default function Home() {
  return (
    // Updated styling for overall page to use theme variables and fill the screen
    <main className="flex justify-center items-center min-h-svh bg-gradient-to-br from-background to-secondary">
      <div className="w-full h-svh">
        <KGPTChat />
      </div>
    </main>
  );
}
