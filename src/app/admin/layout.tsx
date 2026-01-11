'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from "@/components/header";
import AdminSidebar from "@/components/admin/admin-sidebar";

const isAuthenticatedClient = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('isAdminAuthenticated') === 'true';
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedClient());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(isAuthenticatedClient());
    };

    // This listens for changes in session storage that happen in other tabs,
    // but we can also use it to react to our own changes.
    // A more direct way is to just set state, but this is a robust way to sync.
    window.addEventListener('storage', handleStorageChange);
    
    // Check auth status on initial load and path changes.
    const authStatus = isAuthenticatedClient();
    setIsAuthenticated(authStatus);

    if (pathname !== '/admin/login' && !authStatus) {
      router.replace('/admin/login');
    }
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname, router]);


  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (!isAuthenticated) {
      return null; // or a loading spinner
  }

  return (
    <>
      <div className="min-h-screen w-full bg-background text-foreground">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
