'use client';

import { useLayoutEffect, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from "@/components/header";
import AdminSidebar from "@/components/admin/admin-sidebar";

// This is a simplified client-side check.
// For production, a more robust authentication (e.g., JWT, sessions) would be recommended.
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedClient());
  }, []);

  useLayoutEffect(() => {
    if (pathname !== '/admin/login' && !isAuthenticatedClient()) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (!isAuthenticated) {
      return null; // Or a loading spinner, but null is fine to prevent content flash
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
