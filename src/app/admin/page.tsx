import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getPerfumes, getLoggedQueries } from "@/services/mysql/store";
import { DollarSign, MessageSquare, Package, Library } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const [perfumes, queries] = await Promise.all([
    getPerfumes(true),
    getLoggedQueries()
  ]);

  const totalPerfumes = perfumes.length;
  const totalQueries = queries.length;
  const visiblePerfumes = perfumes.filter(p => p.isVisible).length;
  const highestPrice = Math.max(...perfumes.map(p => p.price), 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Perfumes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPerfumes}</div>
            <p className="text-xs text-muted-foreground">
              Across all visibility settings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logged Queries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              Total user questions recorded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visible Perfumes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visiblePerfumes}</div>
            <p className="text-xs text-muted-foreground">
              Currently shown to users
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Highest Price
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${highestPrice}</div>
            <p className="text-xs text-muted-foreground">
              Peak price point in collection
            </p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Collection</CardTitle>
              <CardDescription>
                Add, edit, and control the visibility of your exclusive fragrances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/perfumes" passHref>
                <Button>Go to Perfumes</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Define Your Brand</CardTitle>
              <CardDescription>
                Craft the narrative and information that defines FGPerfume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/brand" passHref>
                <Button>Go to Brand Info</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
