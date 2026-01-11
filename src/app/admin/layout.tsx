import Header from "@/components/header";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
