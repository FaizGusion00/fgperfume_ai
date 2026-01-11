'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FGPAiLogo } from './icons';
import { Button } from './ui/button';
import { Shield } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FGPAiLogo className="h-8 w-auto text-foreground" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-2">
                 <Link href="/admin" passHref>
                    <Button variant={isAdminPage ? "secondary" : "ghost"} size="icon" className="flex items-center gap-2">
                       <Shield className="h-4 w-4" />
                       <span className="sr-only">Admin Panel</span>
                    </Button>
                </Link>
                <ThemeToggle />
            </nav>
        </div>
      </div>
    </header>
  );
}
