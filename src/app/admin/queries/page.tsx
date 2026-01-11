import { getLoggedQueries } from "@/services/mysql/store";
import QueryLogTable from "@/components/admin/query-log-table";

export default async function QueriesPage() {
  const queries = await getLoggedQueries();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 font-headline">User Query Logs</h1>
      <p className="text-muted-foreground mb-6">Review questions asked by users to identify knowledge gaps.</p>
      <QueryLogTable queries={queries} />
    </div>
  );
}
