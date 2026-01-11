import { getPerfumes } from "@/services/mysql/store";
import PerfumeTable from "@/components/admin/perfume-table";

export default async function PerfumesPage() {
  const perfumes = await getPerfumes(true);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Manage Perfumes</h1>
      <PerfumeTable initialPerfumes={perfumes} />
    </div>
  );
}
