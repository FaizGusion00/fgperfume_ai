import AIChatConcierge from '@/components/ai-chat-concierge';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animated-gradient">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tight text-foreground">
            FGPerfume
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl">
            Discover the essence of affordable luxury. Our AI Concierge is at your service to unveil the stories behind our exclusive fragrances.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-8 z-10 flex flex-col flex-grow min-h-0">
          <AIChatConcierge />
        </div>
      </main>
    </div>
  );
}