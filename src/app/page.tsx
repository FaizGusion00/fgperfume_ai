import Image from 'next/image';
import AIChatConcierge from '@/components/ai-chat-concierge';
import {PlaceHolderImages} from '@/lib/placeholder-images';
import Header from '@/components/header';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-perfume');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="absolute inset-0 w-full h-full z-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              style={{ objectFit: 'cover' }}
              className="opacity-20"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 -mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tight text-foreground">
            FGPerfume
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl">
            Discover the essence of luxury. Our AI Concierge is at your service to unveil the stories behind our exclusive fragrances.
          </p>
        </div>

        <div className="w-full h-[32rem] md:h-[36rem] lg:h-[40rem] max-w-3xl mt-8 z-10">
          <AIChatConcierge />
        </div>
      </main>
    </div>
  );
}
