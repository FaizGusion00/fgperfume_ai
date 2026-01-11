'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Perfume } from '@/lib/mock-data';
import { addPerfumeAction, updatePerfumeAction } from '@/app/admin/actions';
import { useTransition } from 'react';

const perfumeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  inspiration: z.string().min(1, "Inspiration is required"),
  character: z.string().min(1, "Character is required"),
  usage: z.string().min(1, "Usage is required"),
  longevity: z.string().min(1, "Longevity is required"),
  topNotes: z.string().min(1, "Top notes are required."),
  middleNotes: z.string().min(1, "Middle notes are required."),
  baseNotes: z.string().min(1, "Base notes are required."),
  price: z.coerce.number().min(0, "Price must be positive"),
  availability: z.enum(['In Stock', 'Out of Stock']),
  isVisible: z.boolean(),
});

type PerfumeFormValues = z.infer<typeof perfumeFormSchema>;

interface PerfumeFormProps {
  perfume?: Perfume;
  onSuccess: () => void;
}

export function PerfumeForm({ perfume, onSuccess }: PerfumeFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<PerfumeFormValues>({
    resolver: zodResolver(perfumeFormSchema),
    defaultValues: {
      name: perfume?.name || '',
      inspiration: perfume?.inspiration || '',
      character: perfume?.character || '',
      usage: perfume?.usage || '',
      longevity: perfume?.longevity || '',
      topNotes: perfume?.topNotes.join(', ') || '',
      middleNotes: perfume?.middleNotes.join(', ') || '',
      baseNotes: perfume?.baseNotes.join(', ') || '',
      price: perfume?.price || 0,
      availability: perfume?.availability || 'In Stock',
      isVisible: perfume?.isVisible ?? true,
    },
  });

  function onSubmit(data: PerfumeFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
          if (key === 'isVisible') {
              if (value) formData.append(key, 'on');
          } else {
            formData.append(key, String(value));
          }
      });
      
      const action = perfume ? updatePerfumeAction(perfume.id, formData) : addPerfumeAction(formData);
      const result = await action;

      if (result.success) {
        toast({ title: `Perfume ${perfume ? 'updated' : 'added'} successfully.` });
        onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to ${perfume ? 'update' : 'add'} perfume.`,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Noir Essence" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inspiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inspiration</FormLabel>
              <FormControl>
                <Textarea placeholder="A walk through a forest at midnight..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="character"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Character</FormLabel>
                <FormControl>
                    <Input placeholder="Mysterious, deep, sophisticated" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="usage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Usage</FormLabel>
                <FormControl>
                    <Input placeholder="Evening wear, autumn/winter" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="topNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Notes (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Bergamot, Pink Pepper" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Notes (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Incense, Orris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baseNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Notes (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Vetiver, Patchouli, Vanilla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="250" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="longevity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Longevity</FormLabel>
                <FormControl>
                    <Input placeholder="Long-lasting" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Visible to Users</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Perfume'}
        </Button>
      </form>
    </Form>
  );
}
