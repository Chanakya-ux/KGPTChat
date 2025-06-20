
import { KGPTChat } from '@/components/kgpt-chat/index'; // Explicitly point to the index file in the directory

export default function Home() {
  return (

    <main
      className="flex justify-center items-center bg-gradient-to-br from-background to-secondary"
      style={{ minHeight: 'calc(var(--app-height, 100dvh))' }}
    >
      <div
        className="w-full max-w-3xl mx-auto"
        style={{ height: 'calc(var(--app-height, 100dvh))' }}
      >

    // Updated styling for overall page to use theme variables and fill the screen
    <main className="flex justify-center items-center min-h-dvh bg-gradient-to-br from-background to-secondary">
      <div className="w-full h-dvh">

        <KGPTChat />
      </div>
    </main>
  );
}
