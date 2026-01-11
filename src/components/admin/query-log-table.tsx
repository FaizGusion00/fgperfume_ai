'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UserQueryLog } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

interface QueryLogTableProps {
  queries: UserQueryLog[];
}

export default function QueryLogTable({ queries }: QueryLogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query</TableHead>
            <TableHead className="w-[200px] text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.query}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
