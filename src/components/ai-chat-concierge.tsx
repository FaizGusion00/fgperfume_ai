'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { askAI, type ChatMessage } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AIChatConcierge() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const initialMessage: ChatMessage = {
    id: '0',
    role: 'assistant',
    content: 'Welcome to FGPerfume. How may I assist you today?'
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      try {
        const aiResponse = await askAI(newMessages, input);
        const newAIMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
        };
        setMessages((prev) => [...prev, newAIMessage]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get a response from the AI. Please try again.",
        });
        setMessages(messages); // Revert to previous state on error
      }
    });
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" style={{ animationDelay: '0s' }}></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" style={{ animationDelay: '0.2s' }}></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-accent" style={{ animationDelay: '0.4s' }}></span>
    </div>
  );

  return (
    <Card className="w-full h-full flex flex-col shadow-2xl rounded-lg border-accent/20 bg-background/50 backdrop-blur-xl">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-2 font-headline text-xl text-accent">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Concierge
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        <ScrollArea className="flex-grow" viewportRef={scrollViewportRef}>
          <div className="p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3 animate-fade-in-up',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border border-accent/50">
                    <AvatarFallback className="bg-accent/20 text-accent">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap shadow-md',
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  )}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
              <div className="flex items-start gap-3 justify-start animate-fade-in-up">
                <Avatar className="w-8 h-8 border border-accent/50">
                   <AvatarFallback className="bg-accent/20 text-accent">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg shadow-md rounded-bl-none">
                    <TypingIndicator />
                </div>
              </div>
            )}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our fragrances..."
            className="flex-grow bg-secondary/50 focus-visible:ring-accent"
            disabled={isPending}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()} variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}