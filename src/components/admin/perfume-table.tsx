'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { PerfumeForm } from './perfume-form';
import type { Perfume } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { deletePerfumeAction } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';

interface PerfumeTableProps {
  initialPerfumes: Perfume[];
}

export default function PerfumeTable({ initialPerfumes }: PerfumeTableProps) {
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedPerfume(undefined);
    // Refresh the route so server components re-run and show updated data.
    router.refresh();
  };

  const openAddDialog = () => {
    setSelectedPerfume(undefined);
    setFormOpen(true);
  };

  const openEditDialog = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
        const res = await deletePerfumeAction(id);
        if (res && res.success) {
          toast({ title: "Perfume deleted successfully." });
          router.refresh();
        } else {
          toast({ variant: 'destructive', title: 'Delete failed', description: res?.error || 'Unable to delete perfume.' });
        }
    });
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Perfume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedPerfume ? 'Edit' : 'Add'} Perfume</DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-1 pr-2">
                <PerfumeForm perfume={selectedPerfume} onSuccess={handleFormSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPerfumes.map((perfume) => (
              <TableRow key={perfume.id}>
                <TableCell className="font-medium">{perfume.name}</TableCell>
                <TableCell>${perfume.price}</TableCell>
                <TableCell>
                  <Badge variant={perfume.availability === 'In Stock' ? 'default' : 'destructive'} className={cn(perfume.availability === 'In Stock' ? "bg-green-600" : "bg-red-600")}>
                    {perfume.availability}
                  </Badge>
                </TableCell>
                <TableCell>
                  {perfume.isVisible ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(perfume)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the perfume
                                and remove its data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(perfume.id)} disabled={isPending}>
                                {isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
