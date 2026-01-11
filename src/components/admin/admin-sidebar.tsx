'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Library, MessageSquare, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FGPAiLogo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/perfumes', label: 'Perfumes', icon: Package },
  { href: '/admin/brand', label: 'Brand', icon: Library },
  { href: '/admin/contact', label: 'Contact', icon: Phone },
  { href: '/admin/queries', label: 'User Queries', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar-background p-4 hidden md:flex flex-col">
       <div className="flex items-center justify-center gap-2 h-10 mb-4">
        <FGPAiLogo className="h-8 w-auto text-sidebar-foreground" />
      </div>
      <Separator className="mb-4 bg-sidebar-border" />
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} passHref>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
