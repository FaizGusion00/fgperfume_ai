'use client';

import { useLayoutEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from "@/components/header";
import AdminSidebar from "@/components/admin/admin-sidebar";

// This is a simplified client-side check.
// For production, a more robust authentication (e.g., JWT, sessions) would be recommended.
const isAuthenticated = () => {
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

  useLayoutEffect(() => {
    if (pathname !== '/admin/login' && !isAuthenticated()) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);


  if (pathname === '/admin/login') {
    return <div className="dark">{children}</div>;
  }
  
  if (!isAuthenticated()) {
      return null; // Or a loading spinner
  }

  return (
    <div className="dark">
      <div className="min-h-screen w-full bg-background text-foreground">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
