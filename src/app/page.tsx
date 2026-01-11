'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';

const AIChatConcierge = dynamic(() => import('@/components/ai-chat-concierge'), {
  ssr: false,
  loading: () => <AIChatSkeleton />,
});

const AIChatSkeleton = () => (
    <div className="w-full h-full flex flex-col shadow-2xl rounded-lg border-accent/20 bg-background/50 backdrop-blur-xl">
        <div className="p-4 border-b border-border/50">
            <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex-grow p-6 space-y-4">
            <div className="flex items-start gap-3 justify-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-10 w-3/4 rounded-lg" />
            </div>
        </div>
        <div className="p-4 border-t border-border/50 flex items-center gap-2">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-10" />
        </div>
    </div>
);


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
